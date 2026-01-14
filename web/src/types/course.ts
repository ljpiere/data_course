export interface Webinar {
    id: string;
    number: number;
    title: string;
    filename: string;
    type: 'Practical' | 'Theoretical';
}

export interface Sprint {
    id: string;
    number: number;
    title: string;
    webinars: Webinar[];
}
