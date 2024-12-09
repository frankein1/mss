import { createQuery } from '~/server/route'
import { RowType, WorksheetType } from '~/types/export'
import { GetBudgetInput, getBudgetSchema } from '~/server/schema'
import { ProtectedAppContext } from '~/server/trpc'
import { createExport } from '~/utils/export/createExport'
import { AllowSecurityCheck } from '~/server/security/rules/types'
import { getBudget } from '~/server/services/budget/getBudget.service'
import { getRowTotal, getExpensesRows, getIncomeRows } from './helpers'
import { formatBudgetMemberLabel } from '~/utils/budget'
import {
  getTotalExpenses,
  getTotalIncome
} from '~/server/services/budget/helpers'

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
      label: 'Nombre de personnes dans le foyer',
      value: budget.numberHouseholdMembers
        ? budget.numberHouseholdMembers.toFixed(0)
        : ''
    },
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
    const footer = {
      label: 'Total ' + formatBudgetMemberLabel(income),
      value: getRowTotal(rows).toFixed(2) + ' €',
      bold: true
    }
    return [header, ...rows, footer]
  })

  const totalIncome = {
    label: 'Revenus du foyer fiscal',
    value:
      getTotalIncome(budget.incomes) != null
        ? getTotalIncome(budget.incomes)?.toFixed(2) + ' €'
        : '-',
    bold: true
  }

  exportData.push({
    name: 'Revenus',
    columns: incomeColumns,
    rows: [...beneficiariesRows.flat(), totalIncome]
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

  const expensesRows: RowType[] = getExpensesRows(budget.expenses)

  const loansRows = budget.expenses?.loans.map(loan => ({
    label: loan.type || '',
    value: loan.amountPerMonth?.toFixed(2) + ' €' || '0'
  }))
  const debtRows = budget.expenses?.debts.map(debt => ({
    label: debt.type || '',
    value: debt.amountPerMonth?.toFixed(2) + ' €' || '0'
  }))

  if (loansRows && loansRows.length > 0) {
    expensesRows.push(
      {
        label: 'Crédit(s)',
        value: '',
        bold: true
      },
      ...loansRows,
      {
        label: 'Total crédit(s)',
        value: getRowTotal(loansRows).toFixed(2) + ' €',
        bold: true
      }
    )
  }
  if (debtRows && debtRows.length > 0) {
    expensesRows.push(
      {
        label: 'Dette(s)',
        value: '',
        bold: true
      },
      ...debtRows,
      {
        label: 'Total dette(s)',
        value: getRowTotal(debtRows).toFixed(2) + ' €',
        bold: true
      }
    )
  }

  const totalExpensesRow = {
    label: 'Charges du foyer fiscal',
    value:
      budget.expenses && getTotalExpenses(budget.expenses)
        ? (getTotalExpenses(budget.expenses) || 0).toFixed(2) + ' €'
        : '-',
    bold: true
  }

  exportData.push({
    name: 'Dépenses',
    columns: expensesColumns,
    rows: [...expensesRows, totalExpensesRow]
  })

  // Create export
  return await createExport(ctx.user.id, exportData)
}

export const exportBudget = createQuery({
  inputValidation: getBudgetSchema,
  securityCheck: AllowSecurityCheck,
  handler
})
