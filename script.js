
/* =========================================
   NEXTGEN CUSTOM CURSOR
========================================= */

const customCursor = document.querySelector(".custom-cursor");

const supportsCustomCursor =
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (customCursor && supportsCustomCursor) {
    document.body.classList.add("has-custom-cursor");

    document.addEventListener("mousemove", (event) => {
        customCursor.style.left = `${event.clientX}px`;
        customCursor.style.top = `${event.clientY}px`;
    });

    document.addEventListener("mouseover", (event) => {
        const target = event.target;

        if (
            target instanceof Element &&
            target.closest("a, button, input, select, textarea, [role='button']")
        ) {
            customCursor.classList.add("is-hovering");
        } else {
            customCursor.classList.remove("is-hovering");
        }
    });

    document.addEventListener("mouseleave", () => {
        customCursor.style.opacity = "0";
    });

    document.addEventListener("mouseenter", () => {
        customCursor.style.opacity = "";
    });
}



/* =================================
   NEXTGEN REGISTRATION + WHATSAPP
================================= */

const enrollmentForm = document.querySelector("#enrollment-form");
const formStatus = document.querySelector("#form-status");

if (enrollmentForm && formStatus) {
    enrollmentForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const submitButton = enrollmentForm.querySelector(
            'button[type="submit"]'
        );

        const originalButtonText = submitButton.innerHTML;

        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";
        formStatus.textContent = "Sending your registration...";

        try {
            const response = await fetch(enrollmentForm.action, {
                method: "POST",
                body: new FormData(enrollmentForm),
                headers: {
                    Accept: "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Registration submission failed.");
            }

            const formData = new FormData(enrollmentForm);

            const name = formData.get("full_name");
            const course = formData.get("course");
            const level = formData.get("experience_level");

            const message =
                `Hello NextGen Tech Academy! I have just submitted my registration form.\n\n` +
                `Name: ${name}\n` +
                `Course of interest: ${course}\n` +
                `Experience level: ${level}\n\n` +
                `Please guide me on the next steps for enrollment.`;

            const whatsappURL =
                "https://wa.me/2347067208549?text=" +
                encodeURIComponent(message);

            formStatus.textContent =
                "Registration received! Redirecting you to WhatsApp...";

            window.location.href = whatsappURL;

        } catch (error) {
            formStatus.textContent =
                "We couldn't submit your registration. Please check your connection and try again.";

            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;

            console.error("Enrollment submission error:", error);
        }
    });
}



/* =================================
   NEXTGEN SCROLL-REVEAL SCRIPT
================================= */

const revealElements = document.querySelectorAll(
    ".hero-content, .courses-section, .course-card, " +
    ".learning-section, .learning-card, .about-content, " +
    ".about-highlight, .about-mission, .enrollment-info, " +
    ".enrollment-form-card"
);

revealElements.forEach((element) => {
    element.classList.add("reveal");
});

const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12
    }
);

revealElements.forEach((element) => {
    revealObserver.observe(element);
});



/* =================================
   NEXTGEN COURSE CAROUSEL CONTROLS
================================= */

const coursesTrack = document.querySelector("#courses-track");
const previousCoursesButton = document.querySelector(".carousel-prev");
const nextCoursesButton = document.querySelector(".carousel-next");

if (coursesTrack && previousCoursesButton && nextCoursesButton) {

    function getCourseScrollAmount() {
        const courseCard = coursesTrack.querySelector(".course-card");

        if (!courseCard) return 300;

        const trackStyles = window.getComputedStyle(coursesTrack);
        const gap = parseFloat(trackStyles.columnGap) || 0;

        return courseCard.getBoundingClientRect().width + gap;
    }

    function updateCourseArrows() {
        const maxScrollLeft =
            coursesTrack.scrollWidth - coursesTrack.clientWidth;

        previousCoursesButton.disabled =
            coursesTrack.scrollLeft <= 2;

        nextCoursesButton.disabled =
            coursesTrack.scrollLeft >= maxScrollLeft - 2;
    }

    previousCoursesButton.addEventListener("click", () => {
        coursesTrack.scrollBy({
            left: -getCourseScrollAmount(),
            behavior: "smooth"
        });
    });

    nextCoursesButton.addEventListener("click", () => {
        coursesTrack.scrollBy({
            left: getCourseScrollAmount(),
            behavior: "smooth"
        });
    });

    coursesTrack.addEventListener("scroll", updateCourseArrows);
    window.addEventListener("resize", updateCourseArrows);

    updateCourseArrows();
}


/* =================================
   NEXTGEN MOBILE NAVIGATION
================================= */

const menuToggle = document.querySelector("#menu-toggle");
const mainNavigation = document.querySelector("#main-navigation");

if (menuToggle && mainNavigation) {

    function closeMobileMenu() {
        mainNavigation.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
    }

    menuToggle.addEventListener("click", () => {
        const isOpen = mainNavigation.classList.toggle("is-open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
    });

    // Close the menu after a visitor selects a link
    mainNavigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
    });

    // Close the menu when Escape is pressed
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });

    // Reset the menu when returning to desktop layout
    window.addEventListener("resize", () => {
        if (window.innerWidth > 1000) {
            closeMobileMenu();
        }
    });
}
