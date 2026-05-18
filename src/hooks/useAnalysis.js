import { useState, useCallback, useRef } from 'react'
import { analyzeThreats } from '../utils/analyzeThreats'
import { SCAN_STEPS } from '../utils/constants'

export function useAnalysis() {
  const [status, setStatus] = useState('idle') // idle | scanning | done | error
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [currentStep, setCurrentStep] = useState(-1)
  const stepIntervalRef = useRef(null)

  const startStepAnimation = useCallback(() => {
    setCurrentStep(0)
    let step = 0
    stepIntervalRef.current = setInterval(() => {
      step += 1
      if (step < SCAN_STEPS.length) {
        setCurrentStep(step)
      } else {
        clearInterval(stepIntervalRef.current)
      }
    }, 700)
  }, [])

  const finishSteps = useCallback(() => {
    clearInterval(stepIntervalRef.current)
    setCurrentStep(SCAN_STEPS.length)
  }, [])

  const analyze = useCallback(async ({ type, content }) => {
    setStatus('scanning')
    setResult(null)
    setError(null)
    startStepAnimation()

    try {
      const data = await analyzeThreats({ type, content })
      finishSteps()
      setTimeout(() => {
        setResult(data)
        setStatus('done')
      }, 300)
    } catch (err) {
      finishSteps()
      setError(err.message || 'Analysis failed. Please try again.')
      setStatus('error')
    }
  }, [startStepAnimation, finishSteps])

  const reset = useCallback(() => {
    clearInterval(stepIntervalRef.current)
    setStatus('idle')
    setResult(null)
    setError(null)
    setCurrentStep(-1)
  }, [])

  return { status, result, error, currentStep, analyze, reset }
}
