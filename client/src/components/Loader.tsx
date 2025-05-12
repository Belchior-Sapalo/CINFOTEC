import {BounceLoader} from 'react-spinners'

export function Loader({label = "Carregando..."}:{label?: string}){
    return (
        <div className='min-h-screen flex flex-col items-center justify-center gap-4'>
            <BounceLoader color='var(--color-gray-500)'/>
            <p className='text-gray-500'>{label}</p>
        </div>
    )
}