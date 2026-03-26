export function formatFiatAmount(value: string): string;

export function parseToSmallest(str: string, decimals: number): bigint;

export function formatSmallest(amount: bigint, decimals: number): string;

export function formatSmallestTrimmed(amount: bigint, decimals: number): string;

export function parseFiatFromDisplay(value: string): number | null;

export function parseBtcFromSubAmount(value: string): number | null;

export function currencyToSmallest(currencyStr: string, price: number, tokenDecimals: number): bigint;

export function smallestToCurrency(amount: bigint, tokenDecimals: number, price: number): number;
