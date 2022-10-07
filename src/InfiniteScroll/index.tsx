import React from 'react'
import { useLockFn, useMemoizedFn, withNativeProps } from 'hgc-utils'
import { FC, useEffect, useRef, useState } from 'react'
function isWindow(element: any | Window): element is Window {
    return element === window
}
export type InfiniteScrollProps = {
    loadMore: () => Promise<void>
    hasMore: boolean
    threshold?: number
    children?: React.ReactNode
}
function mergeProps(a:any, b = {}) {
    return Object.assign(a, b)
}
export const canUseDom = !!(
    typeof window !== 'undefined' &&
    typeof document !== 'undefined' &&
    window.document &&
    window.document.createElement
)
type ScrollElement = HTMLElement | Window
const defaultRoot = canUseDom ? window : undefined
const overflowStylePatterns = ['scroll', 'auto', 'overlay']
function isElement(node: Element) {
    const ELEMENT_NODE_TYPE = 1
    return node.nodeType === ELEMENT_NODE_TYPE
}
export function getScrollParent(
    el: Element,
    root: ScrollElement | null | undefined = defaultRoot
): Window | Element | null | undefined {
    let node = el
    while (node && node !== root && isElement(node)) {
        if (node === document.body) {
            return root
        }
        const { overflowX } = window.getComputedStyle(node)
        if (overflowStylePatterns.includes(overflowX) && node.scrollWidth > node.clientWidth) {
            return node
        }
        node = node.parentNode as Element
    }
    return root
}
export const InfiniteScroll: FC<InfiniteScrollProps> = (p) => {
    const props = mergeProps({ threshold: 250 }, p)
    const doLoadMore = useLockFn(() => props.loadMore())
    const elementRef = useRef<HTMLDivElement>(null)
    // Prevent duplicated trigger of `check` function
    const [flag, setFlag] = useState({})
    const nextFlagRef = useRef(flag)
    const [scrollParent, setScrollParent] = useState<Window | Element | null | undefined>()
    const check = useMemoizedFn(async () => {
        if (nextFlagRef.current !== flag) return
        if (!props.hasMore) return
        const element = elementRef.current
        if (!element) return
        if (!element.offsetParent) return
        const parent = getScrollParent(element)
        setScrollParent(parent)
        if (!parent) return
        const rect = element.getBoundingClientRect()
        const elementTop = rect.left
        const current = isWindow(parent) ? window.innerWidth : parent.getBoundingClientRect().right
        if (current >= elementTop - props.threshold) {
            const nextFlag = {}
            nextFlagRef.current = nextFlag
            await doLoadMore()
            setFlag(nextFlag)
        }
    })
    useEffect(() => {
        check()
    })
    useEffect(() => {
        const element = elementRef.current
        if (!element) return
        if (!scrollParent) return
        function onScroll() {
            check()
        }
        scrollParent.addEventListener('scroll', onScroll)
        return () => {
            scrollParent.removeEventListener('scroll', onScroll)
        }
    }, [scrollParent])
    return withNativeProps(
        props,
        <div ref={ elementRef } >
        { props.children && props.children }
    </div>
    )
}

