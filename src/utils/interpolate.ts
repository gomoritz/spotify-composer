interface InterpolateParams {
    from: number
    to: number
    steps: number
    duration: number
    action: (i: number) => void
}

export class Interpolation {
    private interval: NodeJS.Timeout | null = null

    from: number
    to: number
    steps: number
    duration: number
    action: (i: number) => void

    constructor(params: InterpolateParams) {
        this.from = params.from
        this.to = params.to
        this.steps = params.steps
        this.duration = params.duration
        this.action = params.action
    }

    start(): Promise<void> {
        return new Promise((resolve) => {
            this.interrupt()

            let currentStep = 0
            this.interval = setInterval(() => {
                const perStep = (this.to - this.from) / this.steps
                const min = Math.min(this.from, this.to)
                const max = Math.max(this.from, this.to)
                const value = Math.min(max, Math.max(min, this.from + (perStep * currentStep)))

                this.action(value)
                currentStep++

                if (currentStep > this.steps) {
                    this.interval && clearInterval(this.interval)
                    resolve()
                }
            }, this.duration)
        })
    }

    interrupt() {
        this.interval && clearInterval(this.interval)
    }
}

export default function interpolate(params: InterpolateParams): Interpolation {
    return new Interpolation(params)
}