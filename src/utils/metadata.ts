const siteTitle = "Studentské projekty environmentální výchovy";

const titleSeparator = "|";

const publisher = "NTC ZČU v Plzni";

export const getMetadataTitle = ( title: string|undefined = undefined ) => {
    if ( title )
        return `${title} ${titleSeparator} ${siteTitle}`;
    return siteTitle;
}

export const getMetadataPublisher = () => publisher;