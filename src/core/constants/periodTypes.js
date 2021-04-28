export class PeriodTypeEnum {
    static MONTHLY = 'Monthly';
    static BI_MONTHLY = 'BiMonthly';
    static QUARTERLY = 'Quarterly';
    static SIX_MONTHLY = 'SixMonthly';
    static    SIX_MONTHLY_APRIL = 'SixMonthlyApril';
    static    SIX_MONTHLY_NOVEMBER = 'SixMonthlyNovember';
    static    YEARLY = 'Yearly';
    static    FINANCIAL_APRIL = 'FinancialApril';
    static   FINANCIAL_JULY = 'FinancialJuly';
    static    FINANCIAL_OCTOBER = 'FinancialOctober';
    static   FINANCIAL_NOVEMBER = 'FinancialNovember';
    static    RELATIVE_WEEK = 'RelativeWeek';
    static    RELATIVE_MONTH = 'RelativeMonth';
    static    RELATIVE_BI_MONTH = 'RelativeBiMonth';
    static    RELATIVE_SIX_MONTH = 'RelativeSixMonth';
    static   RELATIVE_QUARTER = 'RelativeQuarter';
    static    RELATIVE_YEAR = 'RelativeYear';
    static    RELATIVE_FINANCIAL_YEAR = 'RelativeFinancialYear';
}

const periodTypes = [
    {id: PeriodTypeEnum.MONTHLY, name: PeriodTypeEnum.MONTHLY, rank: 3},
    {id: PeriodTypeEnum.BI_MONTHLY, name: PeriodTypeEnum.BI_MONTHLY, rank: 4},
    {id: PeriodTypeEnum.QUARTERLY, name: PeriodTypeEnum.QUARTERLY, rank: 5},
    {id: PeriodTypeEnum.SIX_MONTHLY, name: PeriodTypeEnum.SIX_MONTHLY, rank: 6},
    {
        id: PeriodTypeEnum.SIX_MONTHLY_APRIL,
        name: PeriodTypeEnum.SIX_MONTHLY_APRIL,
        rank: 6,
    },
    {
        id: PeriodTypeEnum.SIX_MONTHLY_NOVEMBER,
        name: PeriodTypeEnum.SIX_MONTHLY_NOVEMBER,
        rank: 6,
    },
    {id: PeriodTypeEnum.YEARLY, name: PeriodTypeEnum.YEARLY, rank: 7},
    {
        id: PeriodTypeEnum.FINANCIAL_APRIL,
        name: PeriodTypeEnum.FINANCIAL_APRIL,
        rank: 7,
    },
    {
        id: PeriodTypeEnum.FINANCIAL_JULY,
        name: PeriodTypeEnum.FINANCIAL_JULY,
        rank: 7,
    },
    {
        id: PeriodTypeEnum.FINANCIAL_OCTOBER,
        name: PeriodTypeEnum.FINANCIAL_OCTOBER,
        rank: 7,
    },
    {
        id: PeriodTypeEnum.FINANCIAL_NOVEMBER,
        name: PeriodTypeEnum.FINANCIAL_NOVEMBER,
        rank: 7,
    },
    {
        id: PeriodTypeEnum.RELATIVE_WEEK,
        name: PeriodTypeEnum.RELATIVE_WEEK,
        rank: 2,
    },
    {
        id: PeriodTypeEnum.RELATIVE_MONTH,
        name: PeriodTypeEnum.RELATIVE_MONTH,
        rank: 3,
    },
    {
        id: PeriodTypeEnum.RELATIVE_BI_MONTH,
        name: PeriodTypeEnum.RELATIVE_BI_MONTH,
        rank: 3,
    },
    {
        id: PeriodTypeEnum.RELATIVE_SIX_MONTH,
        name: PeriodTypeEnum.RELATIVE_SIX_MONTH,
        rank: 6,
    },
    {
        id: PeriodTypeEnum.RELATIVE_QUARTER,
        name: PeriodTypeEnum.RELATIVE_QUARTER,
        rank: 5,
    },
    {
        id: PeriodTypeEnum.RELATIVE_YEAR,
        name: PeriodTypeEnum.RELATIVE_YEAR,
        rank: 7,
    },
    {
        id: PeriodTypeEnum.RELATIVE_FINANCIAL_YEAR,
        name: PeriodTypeEnum.RELATIVE_FINANCIAL_YEAR,
        rank: 7,
    },
]

export default periodTypes;
