'use client'

import { useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Mousewheel } from 'swiper/modules'
import 'swiper/css'

type SectionProps = {
    title: string
    color: string
}

export default function Page() {
    useEffect(() => {
        // Prevent rubber-band bounce at page edges
        document.documentElement.style.overscrollBehavior = 'none'
        document.body.style.overscrollBehavior = 'none'
        document.body.style.margin = '0'

        // Add “bounce” easing to the slide transition
        const wrapper = document.querySelector('.swiper-wrapper') as HTMLElement | null
        if (wrapper) {
            wrapper.style.transitionTimingFunction = 'cubic-bezier(0.34, 1.56, 0.64, 1)'
        }
    }, [])

    return (
        <Swiper
            direction="vertical"
            slidesPerView={1}
            mousewheel
            speed={800}
            modules={[Mousewheel]}
            style={{ height: '100vh' }}
        >
            <SwiperSlide>
                <Section title="Live Score" color="#0f172a" />
            </SwiperSlide>

            <SwiperSlide>
                <Section title="Stats" color="#1e293b" />
            </SwiperSlide>

            <SwiperSlide>
                <Section title="Highlights" color="#334155" />
            </SwiperSlide>
        </Swiper>
    )
}

function Section({ title, color }: SectionProps) {
    return (
        <div
            style={{
                height: '100vh',
                background: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 48,
                fontWeight: 700
            }}
        >
            {title}
        </div>
    )
}
