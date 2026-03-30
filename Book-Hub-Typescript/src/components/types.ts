export interface BookdetailsData{
    aboutAuthor:string,
    aboutBook: string,
    authorName: string,
    coverPic: string,
    _id: number,
    rating:string,
    readStatus: string,
    title: string,
    previewLink?: string,
    audio?: string[]
}

export interface ApiResponse{
    status:string,
    data:BookdetailsData|null,
    errorMsg:string|null
}
