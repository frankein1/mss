import { createQuery } from '~/server/route'
import { WorksheetType } from '~/types/export'
import { GetBudgetInput, getBudgetSchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { createExport } from '~/utils/export/createExport'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { getBudget } from '~/server/services/budget/getBudget.service'
import { getExpensesRows, getIncomeRows } from './helpers'
import { formatBudgetMemberLabel } from '~/utils/budget'

const handler = async ({
  input: { familyFileId },
  ctx
}: {
  input: GetBudgetInput
  ctx: ProtectedAppContext
}) => {
  const exportData: WorksheetType[] = []
  const budget = await getBudget({ ctx, familyFileId })

  // General informations
  const infoColumns = [
    {
      key: 'label',
      header: 'Infos générales'
    },
    {
      key: 'value',
      header: ''
    }
  ]

  const infoRows = [
    {
      label: 'Épargne',
      value: budget.savings ? budget.savings.toFixed(2) + ' €' : ''
    },
    {
      label: 'Découvert',
      value: budget.overdraft ? budget.overdraft.toFixed(2) + ' €' : ''
    },
    {
      label: 'Banque de France',
      value: budget.banqueDeFrance
        ? budget.banqueDeFrance.toFixed(2) + ' €'
        : ''
    },
    {
      label: 'Quotient familial',
      value: budget.familyQuotient ? budget.familyQuotient.toFixed(0) : ''
    },
    {
      label: 'Reste à vivre du foyer',
      value: budget.remainingAfterExpenses
        ? budget.remainingAfterExpenses.toFixed(2) + ' €'
        : ''
    }
  ]
  exportData.push({
    name: 'Infos générales',
    columns: infoColumns,
    rows: infoRows
  })

  // Incomes
  const incomeColumns = [
    {
      key: 'label',
      header: 'Revenus du foyer'
    },
    {
      key: 'value',
      header: 'Montant en euro'
    }
  ]

  const beneficiariesRows = budget.incomes.map(income => {
    const header = {
      label: formatBudgetMemberLabel(income),
      value: '',
      bold: true
    }
    const rows = getIncomeRows(income)
    return [header, ...rows]
  })

  exportData.push({
    name: 'Revenus',
    columns: incomeColumns,
    rows: beneficiariesRows.flat()
  })

  // Expenses
  const expensesColumns = [
    {
      key: 'label',
      header: 'Nature de la dépense'
    },
    {
      key: 'value',
      header: 'Montant en euro'
    }
  ]

  const expensesRows = getExpensesRows(budget.expenses)

  const loansRows = budget.expenses?.loans.map(loan => ({
    label: loan.type || '',
    value: Number(loan.amountPerMonth) || 0
  }))
  const debtRows = budget.expenses?.debts.map(debt => ({
    label: debt.type || '',
    value: Number(debt.amountPerMonth) || 0
  }))

  if (loansRows && loansRows.length > 0) {
    expensesRows.push(
      {
        label: 'Crédit(s)',
        value: '',
        bold: true
      },
      ...loansRows
    )
  }
  if (debtRows && debtRows.length > 0) {
    expensesRows.push(
      {
        label: 'Dette(s)',
        value: '',
        bold: true
      },
      ...debtRows
    )
  }

  exportData.push({
    name: 'Dépenses',
    columns: expensesColumns,
    rows: expensesRows
  })

  // Create export
  return await createExport(ctx.user.id, exportData)
}

export const exportBudget = createQuery({
  inputValidation: getBudgetSchema,
  securityCheck: AllowSecurityCheck,
  handler
})
