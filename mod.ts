interface Person {
    district?: string,
    party: string,
    number?: string,
    image: string,
    name: string,
    hanjaName?: string,
    gender: "남" | "여",
    birth: string | null,
    education?: string,
    history?: string,
    byElectionDate?: string,
    promise?: {
        [promiseType: string]: string
    } | ""
}

export default 
<{
    council: {
        [local: string]: {
            member: string[],
            head: string,
            highMember?: string[]
        }
    },
    member: {
        [personCode: string]: Person
    }    
}>