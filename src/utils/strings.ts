export const generateRandomString = ( length:number=6 )=>Math.random().toString(20).substr(2, length)

export const generateRandomColor = () => {
    return [
        "blue",
        "black",
        "brown",
        "orange",
        "violet"
    ].sort( () => ( Math.random() * 2 ) - 1 )[0];
}