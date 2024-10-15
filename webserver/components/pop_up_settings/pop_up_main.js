import { useState, useEffect, useRef } from "react"
import { getDarkerColour } from '../../utils/colour';
import Cookies from 'js-cookie'

export default function PopUpMain({ colour, children }) {

    {/** Header size vars for sizing the header dynamically */}
    const PopupheaderRef = useRef(null);
    const PopupContentRef = useRef(null);
    const [headerW, setHeaderW] = useState(null);
    const [contentH, setcontentH] = useState(null);
    const [contentW, setcontentW] = useState(null);

    {/** Animation State Vars */}
    const [expand_settings_container, set_expand_settings_container] = useState(false);
    const [make_settings_name_invisible, set_make_settings_name_invisible] = useState(false);
    const [remove_settings_name, set_remove_settings_name] = useState(false);
    const [make_settings_invisible, set_make_settings_invisible] = useState(true);
    const [remove_settings, set_remove_settings] = useState(true);
    const [double_minimised, set_double_minimised] = useState(false);

    const expandSettingsContainerRef = useRef(expand_settings_container);
    const expandDouble_minimisedRef = useRef(double_minimised);
    useEffect(() => {
        expandSettingsContainerRef.current = expand_settings_container;
        expandDouble_minimisedRef.current = double_minimised;
      }, [expand_settings_container, double_minimised]);

    useEffect(() => {
        let lastScrollTop = 0;
        const handleScroll = () => {
            // if(pause_for_animation) return
            const st = window.pageYOffset || document.documentElement.scrollTop;
            if (st > lastScrollTop) {
                // Scroll down
                if (expandSettingsContainerRef.current) double_minimise_from_expanded()
                else if (!expandDouble_minimisedRef.current) { double_minimise_from_normal_minimised() }
            } else {
                // Scroll up
                if (expandDouble_minimisedRef.current) wake_frome_double_minimised()
            }
            lastScrollTop = st <= 0 ? 0 : st; // For mobile or negative scrolling
        };
    
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        
        if (PopupheaderRef.current) {
            setHeaderW(PopupheaderRef.current.scrollWidth);
        }
        if (PopupContentRef.current) {
            setcontentH(PopupContentRef.current.scrollHeight);
            setcontentW(PopupContentRef.current.scrollWidth);
        }
      }, [children, remove_settings_name, remove_settings, ]);


    const openSettings = () => {

        set_double_minimised(false)

        // Fade away the settings title 
        set_make_settings_name_invisible(true) // 200ms animation

        // Remove the settings name from the DOM after the animation has finished
        setTimeout(() => {
            set_remove_settings_name(true); // instant
            set_expand_settings_container(true); // 300ms
            set_remove_settings(false) // instant
        }, 200);
        
        // After the box has expanded, fade in the settings content
        setTimeout(() => {
            set_make_settings_invisible(false) // 300ms
        }, 500); // 600 because the box waits 300ms to open then animates opening for another 300ms
    }

    const closeSettings = () => {

        set_make_settings_invisible(true) // 200 ms

        // After the box has expanded, fade in the settings content
        setTimeout(() => {
            set_remove_settings(true) // instant
            set_expand_settings_container(false) // 300ms
            set_remove_settings_name(false);
        }, 300); // 600 because the box waits 300ms to open then animates opening for another 300ms

        // Remove the settings name from the DOM after the animation has finished
        setTimeout(() => {
            set_make_settings_name_invisible(false); // 300ms
        }, 600);
    }

    const double_minimise_from_expanded = () => {
        set_make_settings_invisible(true) // 300 ms

        // After the box has expanded, fade in the settings content
        setTimeout(() => {
            set_remove_settings(true) // instant
            set_expand_settings_container(false)
            set_make_settings_name_invisible(true)
        }, 300);

        setTimeout(() => {
            set_double_minimised(true) // 300ms
        }, 600)
    }

    const double_minimise_from_normal_minimised = () => {
        set_make_settings_name_invisible(true) // 200 ms

        // After the box has expanded, fade in the settings content
        setTimeout(() => {
            set_double_minimised(true)
        }, 200);

    }

    const wake_frome_double_minimised = () => {
        set_double_minimised(false)
        set_make_settings_name_invisible(true)
        setTimeout(() => {
            set_remove_settings_name(false)
            set_make_settings_name_invisible(false)
        }, 300);
    }

    return (
        <div className={`mx-3 flex w-full`}>

            {/** Button */}
            <div 
                className={
                    `z-10 rounded-md flex transition-all ease-in-out relative duration-300   mr-6
                    ${expand_settings_container ? '' : `cursor-pointer ${double_minimised ? 'opacity-30' : 'opacity-100'}`}`
                }
                style={ {
                    backgroundColor: colour,
                    width: expand_settings_container  ? `calc(${contentW}px)` : `calc(${headerW}px)`,
                    height: expand_settings_container  ? `calc(${contentH}px)` : `${double_minimised ? '0.5rem' : '2.25rem'}`
                } }
                onClick={() => {
                        if (expand_settings_container) return;
                        else if (double_minimised) wake_frome_double_minimised(); 
                        else {openSettings()}
                    }}>

                {!remove_settings_name && 
                    <div 
                    className={
                        `mil flex transition-opacity duration-200
                        ${make_settings_name_invisible ? 'opacity-0' : 'opacity-100 '}`
                    }
                    ref={PopupheaderRef}>
                        {children[0]}
                    </div>}

                {!remove_settings && 
                <div 
                    ref={PopupContentRef}
                    className={`w-full ${make_settings_invisible ? 'opacity-0' : 'opacity-100'}`}>
                        { children[1] }
                </div>}
                
            </div>
                        
        </div>
    );

  }