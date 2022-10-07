import { animated, useSpring } from '@react-spring/web';
// import { useIsomorphicLayoutEffect, useThrottleFn } from 'hgc-utils';
import './style.less';
import React, {
  ComponentProps,
  FC,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
} from 'react';
import { classnames, useIsomorphicLayoutEffect, useThrottleFn} from 'hgc-utils';
type IHorizontalScroll = {
  classPrefix: string;
  activeKey: string;
  children?:ReactNode
};
const HorizontalScroll: FC<IHorizontalScroll> = (props) => {
  const { classPrefix, activeKey, children } = props;
  const tabListContainerRef = useRef<HTMLDivElement>(null);
  const keyToIndexRecord: Record<string, number> = {};
  const panes: ReactElement<ComponentProps<any>>[] = [];
  React.Children.forEach(props.children, (child, index) => {
    if (!React.isValidElement(child)) return;
    const key = child.key;
    if (typeof key !== 'string') return;
    const length = panes.push(child);
    keyToIndexRecord[key] = length - 1;
  });

  const [{ leftMaskOpacity, rightMaskOpacity }, maskApi] = useSpring(() => ({
    leftMaskOpacity: 0,
    rightMaskOpacity: 0,
    config: {
      clamp: true,
    },
  }));
  const [{ scrollLeft }, scrollApi] = useSpring(() => ({
    scrollLeft: 0,
    config: {
      tension: 300,
      clamp: true,
    },
  }));

  const { run: updateMask } = useThrottleFn(
    (immediate = false) => {
      const container = tabListContainerRef.current;
      if (!container) return;

      const scrollLeft = container.scrollLeft;
      const showLeftMask = scrollLeft > 0;
      const showRightMask =
        scrollLeft + container.offsetWidth < container.scrollWidth;

      maskApi.start({
        leftMaskOpacity: showLeftMask ? 1 : 0,
        rightMaskOpacity: showRightMask ? 1 : 0,
        immediate,
      });
    },
    {
      wait: 100,
      trailing: true,
      leading: true,
    },
  );
  const [{ x, width }, api] = useSpring(() => ({
    x: 0,
    width: 0,
    config: {
      tension: 300,
      clamp: true,
    },
  }));
  function animate(immediate = false) {
    const container = tabListContainerRef.current;
    if (!container) return;
    const activeIndex = keyToIndexRecord[activeKey as string];
    console.log(
      activeIndex,
      'activeIndex',
      keyToIndexRecord,
      'keyToIndexRecord',
    );
    if (activeIndex === undefined) {
      api.start({
        x: 0,
        width: 0,
        immediate: true,
      });
      return;
    }

    const activeTab = container.children.item(activeIndex) as HTMLDivElement;
    console.log(activeTab, 'activeTab');
    // const activeTab = activeTabWrapper.children.item(0) as HTMLDivElement;
    const activeTabLeft = activeTab.offsetLeft;
    const activeTabWidth = activeTab.offsetWidth;

    const containerWidth = container.offsetWidth;
    const containerScrollWidth = container.scrollWidth;
    const containerScrollLeft = container.scrollLeft;

    const maxScrollDistance = containerScrollWidth - containerWidth;
    if (maxScrollDistance <= 0) return;
    function bound(
      position: number,
      min: number | undefined,
      max: number | undefined,
    ) {
      let ret = position;
      if (min !== undefined) {
        ret = Math.max(position, min);
      }
      if (max !== undefined) {
        ret = Math.min(ret, max);
      }
      return ret;
    }
    const nextScrollLeft = bound(
      activeTabLeft - (containerWidth - activeTabWidth) / 2,
      0,
      containerScrollWidth - containerWidth,
    );
    console.log(nextScrollLeft, containerScrollLeft, 111);
    scrollApi.start({
      scrollLeft: nextScrollLeft,
      from: { scrollLeft: containerScrollLeft },
      immediate,
    });
  }
  useIsomorphicLayoutEffect(() => {
    animate(!x.isAnimating);
  }, []);
  useIsomorphicLayoutEffect(() => {
    updateMask(true);
  }, []);
  useEffect(() => {
    animate();
  }, [activeKey]);
  console.log(panes, 'panes');
  return (
    <div className={classPrefix}>
      <div className={`${classPrefix}-header`}>
        <animated.div
          className={classnames(
            `${classPrefix}-header-mask`,
            `${classPrefix}-header-mask-left`,
          )}
          style={{
            opacity: leftMaskOpacity,
          }}
        />
        <animated.div
          className={classnames(
            `${classPrefix}-header-mask`,
            `${classPrefix}-header-mask-right`,
          )}
          style={{
            opacity: rightMaskOpacity,
          }}
        />
        <animated.div
          className={`${classPrefix}-tab-list`}
          ref={tabListContainerRef}
          scrollLeft={scrollLeft}
          onScroll={updateMask}
        >
          {children}
        </animated.div>
      </div>
    </div>
  );
};

export default HorizontalScroll;