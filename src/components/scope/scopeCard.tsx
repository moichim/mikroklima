import { GoogleScope } from "@/graphql/google/google"
import { Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, Divider } from "@nextui-org/react"
import Link from "next/link"

type ScopeCardProps = GoogleScope

export const ScopeCard: React.FC<ScopeCardProps> = props => {

    return <div
        className="w-full lg:w-1/2 xl:w-1/3 2xl:w-1/4 p-4"
    >
        <Card
            className=" bg-opacity-50 shadow-xl ring-1 ring-slate-300 shadow-violet-300"
            isBlurred
            radius="lg"
        >
            <CardHeader>
                <div className="text-left p-4">
                    <p className="opacity-30 text-xs">Tým:</p>
                    <p className="text-lg font-bold">{props.name}</p>
                    <p className="text-primary text-xs">{props.team}</p>
                </div>
            </CardHeader>
            <CardBody>
                <div className="text-left px-4">
                    {props.description}
                </div>
            </CardBody>
            <Divider />
            <CardFooter>
                <ButtonGroup variant="flat">
                    <Button
                        color="primary"
                        as={Link}
                        href={`/project/${props.slug}/data`}
                    >
                        Data
                    </Button>
                    {props.count > 0 && <Button
                        color="primary"
                        as={Link}
                        href={`/project/${props.slug}/thermo`}
                    >
                        Smínky
                    </Button>}
                </ButtonGroup>
            </CardFooter>
        </Card>
    </div>

}