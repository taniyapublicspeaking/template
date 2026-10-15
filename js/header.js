<!-- =====================================================
     RESPONSIVE NAVIGATION SCRIPT


  Add the following script immediately before the closing </body> tag in your index.html.
====================================================== -->

<script>
document.addEventListener("DOMContentLoaded", function () {

    const menuToggle = document.getElementById("nav-toggle");
    const navigation = document.getElementById("primary-navigation");
    const navLinks = navigation.querySelectorAll(".nav-link, .nav-cta");
    const mobileBreakpoint = window.matchMedia("(max-width: 768px)");

    // Open or close the mobile navigation.
    function setMenuOpen(isOpen) {

        menuToggle.classList.toggle("is-open", isOpen);
        navigation.classList.toggle("is-open", isOpen);

        menuToggle.setAttribute("aria-expanded", String(isOpen));

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );

    }

    // Hamburger button.
    menuToggle.addEventListener("click", function () {

        const isOpen =
            menuToggle.getAttribute("aria-expanded") === "true";

        setMenuOpen(!isOpen);

    });

    // Close the menu after a navigation link is selected.
    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            if (mobileBreakpoint.matches) {
                setMenuOpen(false);
            }

        });

    });

    // Close the menu with the Escape key.
    document.addEventListener("keydown", function (event) {

        if (
            event.key === "Escape" &&
            menuToggle.getAttribute("aria-expanded") === "true"
        ) {
            setMenuOpen(false);
            menuToggle.focus();
        }

    });

    // Close the mobile menu when clicking outside the header.
    document.addEventListener("click", function (event) {

        if (
            mobileBreakpoint.matches &&
            !event.target.closest(".site-header") &&
            menuToggle.getAttribute("aria-expanded") === "true"
        ) {
            setMenuOpen(false);
        }

    });

    // Reset the mobile menu when switching to desktop.
    mobileBreakpoint.addEventListener("change", function (event) {

        setMenuOpen(false);

    });

});
</script>

<!-- END RESPONSIVE NAVIGATION SCRIPT -->
