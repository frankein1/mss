import type { RowType } from '~/types/export'
import { formatBudgetMemberLabel } from '~/utils/budget'
import {
  getTotalExpenses,
  getTotalIncome
} from '~/server/services/budget/helpers'
import type { BudgetWithExpensesAndIncomes } from '~/types/budget'
import {
  getIncomeRows,
  getRowTotal,
  getExpensesRows
} from '~/server/route/budget/helpers'
import ExcelPkg from 'exceljs'

export const exportBudgetWorkbook = (budget: BudgetWithExpensesAndIncomes) => {
  // General informations
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
    },
    {
      label: '',
      value: ''
    }
  ]

  // Expenses
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

  // Incomes
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

  // createExport Workbook
  const { Workbook: WorkbookConstructor } = ExcelPkg

  const workbook = new WorkbookConstructor()
  const worksheet = workbook.addWorksheet('Budget')
  worksheet.columns = [
    {
      key: 'generalInfo',
      header: 'INFOS GÉRÉRALES',
      width: 32
    },
    {
      key: 'generalInfoValue',
      header: '',
      width: 18
    },
    {
      key: 'incomes',
      header: 'Revenus du foyer',
      width: 32
    },
    {
      key: 'incomesValue',
      header: 'Montant en euro',
      width: 18
    },
    {
      key: 'expenses',
      header: 'Dépenses du foyer',
      width: 32
    },
    {
      key: 'expensesValue',
      header: 'Montant en euro',
      width: 18
    }
  ]

  worksheet.getColumn('generalInfo').values = [
    'Informations générales',
    ...infoRows.map(row => row.label)
  ]
  worksheet.getColumn('generalInfoValue').values = [
    '',
    ...infoRows.map(row => row.value)
  ]

  worksheet.getColumn('incomes').values = [
    'Revenus du foyer',
    ...beneficiariesRows.flat().map(row => transformToRichText(row, 'label')),
    transformToRichText(totalIncome, 'label')
  ]
  worksheet.getColumn('incomesValue').values = [
    'Montant en euro',
    ...beneficiariesRows.flat().map(row => transformToRichText(row, 'value')),
    transformToRichText(totalIncome, 'value')
  ]

  worksheet.getColumn('expenses').values = [
    'Dépenses du foyer',
    ...expensesRows.map(row => transformToRichText(row, 'label')),
    transformToRichText(totalExpensesRow, 'label')
  ]
  worksheet.getColumn('expensesValue').values = [
    'Montant en euro',
    ...expensesRows.map(row => transformToRichText(row, 'value')),
    transformToRichText(totalExpensesRow, 'value')
  ]

  // bold header
  worksheet.getRow(1).font = {
    bold: true
  }

  return workbook
}

const transformToRichText = (row: RowType, key: 'value' | 'label') => {
  return {
    richText: [
      {
        text: row[key]?.toString() || '',
        font: { bold: !!row.bold }
      }
    ]
  }
}
