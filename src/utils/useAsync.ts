import { useEffect, useState } from "react"

type AsyncFunction<T> = () => Promise<T>

type AsyncState = "computing" | "done" | "error"

interface AsyncResult<T> {
    result: T | undefined
    error: any | undefined
    state: AsyncState
}

export default function useAsync<T>(func: AsyncFunction<T>): AsyncResult<T> {
    const [result, setResult] = useState<T | undefined>(undefined)
    const [error, setError] = useState<any | undefined>(undefined)
    const [state, setState] = useState<AsyncState>("computing")

    useEffect(() => {
        func().then(result => {
            setResult(result)
            setState("done")
        }).catch(error => {
            setError(error)
            setState("error")
        })
    }, [func])


    return {
        result: result,
        error: error,
        state: state
    }
}