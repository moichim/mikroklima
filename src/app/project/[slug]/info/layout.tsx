import { PropsWithChildren } from "react";

const InfoLayout: React.FC<PropsWithChildren> = props => {

    return <div className="px-5">{props.children}</div>

}

export default InfoLayout;