
export const endpoint = process.env.ENDPOINT || ''
export const DB_GAMES_TABLE = "spell-table-utils-games"
export const errors = {
    INVALID_CONNECTION_ID: 'Invalid ConnectionId on requestContext',
    NO_BODY: 'Error no body was given',
    INVALID_BODY: (value: string) => `Invalid body content, missing values ${value} `,
}