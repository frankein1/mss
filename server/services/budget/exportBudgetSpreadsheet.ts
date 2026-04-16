import { formatBudgetMemberLabel } from '~/utils/budget'
import { prismaDecimalToNumber } from '~/utils/prisma'
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
import type { RowType } from '~/types/export'

const CURRENCY_FORMAT = '#,##0.00 "€"'

export const exportBudgetWorkbook = (budget: BudgetWithExpensesAndIncomes) => {
  // General informations
  const infoRows: {
    label: string
    value: number | string
    monetary?: boolean
  }[] = [
    {
      label: 'Nombre de personnes dans le foyer',
      value: prismaDecimalToNumber(budget.numberHouseholdMembers) ?? ''
    },
    {
      label: 'Épargne',
      value: prismaDecimalToNumber(budget.savings) ?? '',
      monetary: true
    },
    {
      label: 'Découvert',
      value: prismaDecimalToNumber(budget.overdraft) ?? '',
      monetary: true
    },
    {
      label: 'Banque de France',
      value: prismaDecimalToNumber(budget.banqueDeFrance) ?? '',
      monetary: true
    },
    {
      label: 'Quotient familial',
      value: prismaDecimalToNumber(budget.familyQuotient) ?? ''
    },
    {
      label: 'Reste à vivre du foyer',
      value: budget.remainingAfterExpenses ?? '',
      monetary: true
    }
  ]

  // Expenses
  const expensesRows: RowType[] = getExpensesRows(budget.expenses)
  const loansRows = budget.expenses?.loans.map(loan => ({
    label: loan.type || '',
    value: prismaDecimalToNumber(loan.amountPerMonth) ?? 0
  }))
  const debtRows = budget.expenses?.debts.map(debt => ({
    label: debt.type || '',
    value: prismaDecimalToNumber(debt.amountPerMonth) ?? 0
  }))
  if (loansRows && loansRows.length > 0) {
    expensesRows.push(
      { label: 'Crédit(s)', value: '', bold: true },
      ...loansRows,
      { label: 'Total crédit(s)', value: getRowTotal(loansRows), bold: true }
    )
  }
  if (debtRows && debtRows.length > 0) {
    expensesRows.push(
      { label: 'Dette(s)', value: '', bold: true },
      ...debtRows,
      { label: 'Total dette(s)', value: getRowTotal(debtRows), bold: true }
    )
  }
  const totalExpensesRow = {
    label: 'Charges du foyer fiscal',
    value: budget.expenses ? getTotalExpenses(budget.expenses) : null,
    bold: true
  }

  // Incomes
  const beneficiariesRows = budget.incomes.map(income => {
    const header = {
      label: formatBudgetMemberLabel(income),
      value: null,
      bold: true
    }
    const rows = getIncomeRows(income)
    const footer = {
      label: 'Total ' + formatBudgetMemberLabel(income),
      value: getRowTotal(rows),
      bold: true
    }
    return [header, ...rows, footer]
  })

  const totalIncome = {
    label: 'Revenus du foyer fiscal',
    value: getTotalIncome(budget.incomes) ?? null,
    bold: true
  }

  // Build workbook
  const { Workbook: WorkbookConstructor } = ExcelPkg
  const workbook = new WorkbookConstructor()
  const worksheet = workbook.addWorksheet('Budget')

  worksheet.columns = [
    { key: 'generalInfo', header: 'Informations générales', width: 32 },
    { key: 'generalInfoValue', header: '', width: 18 },
    { key: 'incomes', header: 'Revenus du foyer', width: 32 },
    { key: 'incomesValue', header: 'Montant en euro', width: 18 },
    { key: 'expenses', header: 'Dépenses du foyer', width: 32 },
    { key: 'expensesValue', header: 'Montant en euro', width: 18 }
  ]

  worksheet.getRow(1).font = { bold: true }
  worksheet.views = [{ state: 'frozen', ySplit: 1 }]

  const allIncomeRows: RowType[] = [...beneficiariesRows.flat(), totalIncome]
  const allExpensesRows: RowType[] = [...expensesRows, totalExpensesRow]
  const maxLen = Math.max(
    allIncomeRows.length,
    allExpensesRows.length,
    infoRows.length
  )

  for (let i = 0; i < maxLen; i++) {
    const infoRow = infoRows[i]
    const incomeRow = allIncomeRows[i]
    const expenseRow = allExpensesRows[i]

    const row = worksheet.getRow(i + 2)

    row.getCell('generalInfo').value = infoRow?.label ?? ''
    const infoValueCell = row.getCell('generalInfoValue')
    infoValueCell.value = infoRow?.value ?? ''
    if (infoRow?.monetary && typeof infoRow.value == 'number') {
      infoValueCell.numFmt = CURRENCY_FORMAT
    }

    row.getCell('incomes').value = (incomeRow?.label as string) ?? ''
    const incomesValueCell = row.getCell('incomesValue')
    incomesValueCell.value = (incomeRow?.value as number | null) ?? null
    if (typeof incomeRow?.value === 'number') {
      incomesValueCell.numFmt = CURRENCY_FORMAT
    }

    row.getCell('expenses').value = (expenseRow?.label as string) ?? ''
    const expensesValueCell = row.getCell('expensesValue')
    expensesValueCell.value = (expenseRow?.value as number | null) ?? null
    if (typeof expenseRow?.value === 'number') {
      expensesValueCell.numFmt = CURRENCY_FORMAT
    }

    if (incomeRow?.bold) {
      row.getCell('incomes').font = { bold: true }
      incomesValueCell.font = { bold: true }
    }
    if (expenseRow?.bold) {
      row.getCell('expenses').font = { bold: true }
      expensesValueCell.font = { bold: true }
    }
  }

  return workbook
}
