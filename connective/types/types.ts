export type Occupation = {
    id: number,
    name: string
}

export type Industry = {
    id: number,
    name: string,
    occupations: Occupation[]
}