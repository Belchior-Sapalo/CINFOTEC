interface IAtachment {
    id: string
    fileName: string
    type: string
    downloadLink: string
}

export interface IInformation {
    id: string
    title: string
    category: string
    image: IAtachment
    body: string
    createdAt: string
    updatedAt: string
}