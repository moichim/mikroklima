export const StatisticsContent: React.FC<React.PropsWithChildren & {id:string}> = props => {
    return <div id={props.id}>{props.children}</div>;
}