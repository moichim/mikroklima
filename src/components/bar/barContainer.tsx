type BarContainerProps = React.PropsWithChildren & {
    id: string,
    label: React.ReactNode,
    hint?: React.ReactNode
}

export const BarContainer: React.FC<BarContainerProps> = props => {

    return <div id={props.id}>
        <div className="pb-2 uppercase text-sm opacity-50">{props.label}</div>
        {props.children}
        {props.hint && <div className="text-sm lg:hidden">
            {props.hint}
        </div>}
    </div>

}