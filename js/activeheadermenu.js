document.addEventListener("DOMContentLoaded", function () {

    /* =================================================
       ELEMENTS
    ================================================= */

    const menuToggle = document.getElementById("nav-toggle");

    const navigation = document.getElementById(
        "primary-navigation"
    );

    const navLinks = navigation.querySelectorAll(
        ".nav-link, .nav-cta"
    );

    const sectionLinks = navigation.querySelectorAll(
        'a[href^="#"]'
    );

    const mobileBreakpoint = window.matchMedia(
        "(max-width: 768px)"
    );


    /* =================================================
       MOBILE MENU
    ================================================= */

    function setMenuOpen(isOpen) {

        menuToggle.classList.toggle("is-open", isOpen);

        navigation.classList.toggle("is-open", isOpen);

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation"
                : "Open navigation"
        );

    }


    /* =================================================
       ACTIVE NAVIGATION LINK
    ================================================= */

    function setActiveLink(sectionId) {

        let activeLinkFound = false;

        sectionLinks.forEach(function (link) {

            const href = link.getAttribute("href");

            const isActive = href === "#" + sectionId;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "location");
                activeLinkFound = true;
            } else {
                link.removeAttribute("aria-current");
            }

        });

        /*
         * If no navigation link corresponds to the section,
         * remove the active state from all navigation links.
         */

        if (!activeLinkFound) {
            sectionLinks.forEach(function (link) {
                link.classList.remove("active");
                link.removeAttribute("aria-current");
            });
        }

    }


    /* =================================================
       HAMBURGER CLICK
    ================================================= */

    menuToggle.addEventListener("click", function () {

        const isOpen =
            menuToggle.getAttribute("aria-expanded") === "true";

        setMenuOpen(!isOpen);

    });


    /* =================================================
       CLOSE MENU AFTER LINK CLICK
    ================================================= */

    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            if (mobileBreakpoint.matches) {
                setMenuOpen(false);
            }

        });

    });


    /* =================================================
       CLOSE MENU WITH ESCAPE
    ================================================= */

    document.addEventListener("keydown", function (event) {

        const isOpen =
            menuToggle.getAttribute("aria-expanded") === "true";

        if (event.key === "Escape" && isOpen) {

            setMenuOpen(false);

            menuToggle.focus();

        }

    });


    /* =================================================
       CLOSE MENU WHEN CLICKING OUTSIDE
    ================================================= */

    document.addEventListener("click", function (event) {

        const isOpen =
            menuToggle.getAttribute("aria-expanded") === "true";

        if (
            mobileBreakpoint.matches &&
            !event.target.closest(".site-header") &&
            isOpen
        ) {
            setMenuOpen(false);
        }

    });


    /* =================================================
       RESET MENU WHEN SWITCHING SCREEN SIZES
    ================================================= */

    mobileBreakpoint.addEventListener("change", function () {

        setMenuOpen(false);

    });


    /* =================================================
       OBSERVE PAGE SECTIONS
    ================================================= */

    const observedSections = [];

    sectionLinks.forEach(function (link) {

        const href = link.getAttribute("href");

        /*
         * Ignore empty anchors and links that do not point
         * to a valid section on this page.
         */

        if (!href || href === "#") {
            return;
        }

        const section = document.getElementById(
            href.substring(1)
        );

        if (section && !observedSections.includes(section)) {
            observedSections.push(section);
        }

    });


    /* =================================================
       INTERSECTION OBSERVER
    ================================================= */

    if ("IntersectionObserver" in window) {

        const observerOptions = {

            root: null,

            /*
             * Define a central activation area in the viewport.
             */

            rootMargin: "-20% 0px -60% 0px",

            threshold: 0

        };

        const sectionObserver = new IntersectionObserver(
            function (entries) {

                const visibleSections = entries.filter(
                    function (entry) {
                        return entry.isIntersecting;
                    }
                );

                if (visibleSections.length === 0) {
                    return;
                }

                /*
                 * Select the intersecting section closest
                 * to the top of the viewport.
                 */

                visibleSections.sort(function (a, b) {

                    return a.boundingClientRect.top -
                           b.boundingClientRect.top;

                });

                const currentSection = visibleSections[0];

                setActiveLink(currentSection.target.id);

            },
            observerOptions
        );

        observedSections.forEach(function (section) {

            sectionObserver.observe(section);

        });

    } else {

        /*
         * Fallback for browsers without IntersectionObserver.
         */

        window.addEventListener("scroll", function () {

            let currentSection = null;

            const activationPoint = window.innerHeight * 0.3;

            observedSections.forEach(function (section) {

                const rect = section.getBoundingClientRect();

                if (
                    rect.top <= activationPoint &&
                    rect.bottom > activationPoint
                ) {
                    currentSection = section;
                }

            });

            if (currentSection) {
                setActiveLink(currentSection.id);
            }

        }, { passive: true });

    }


    /* =================================================
       INITIAL ACTIVE SECTION
    ================================================= */

    function activateInitialSection() {

        const hash = window.location.hash;

        if (hash) {

            const sectionId = decodeURIComponent(
                hash.substring(1)
            );

            const targetSection = document.getElementById(
                sectionId
            );

            if (
                targetSection &&
                observedSections.includes(targetSection)
            ) {
                setActiveLink(sectionId);
                return;
            }

        }

        /*
         * If the page opens at the top, activate Home.
         */

        if (window.scrollY < 50) {

            const homeSection = document.getElementById("home");

            if (homeSection) {
                setActiveLink("home");
            }

        }

    }

    activateInitialSection();

});
