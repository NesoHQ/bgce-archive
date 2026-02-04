// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="introduction/index.html"><strong aria-hidden="true">1.</strong> Introduction</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="introduction/category/index.html"><strong aria-hidden="true">1.1.</strong> Category</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="introduction/rbac/index.html"><strong aria-hidden="true">1.2.</strong> Rbac</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="introduction/tech-stack/index.html"><strong aria-hidden="true">1.3.</strong> Tech Stack</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="contribution-guide/index.html"><strong aria-hidden="true">2.</strong> Contribution Guide</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="contribution-guide/COMMIT-STRATEGY.html"><strong aria-hidden="true">2.1.</strong> Commit Strategy</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="contribution-guide/CONTRIBUTING.html"><strong aria-hidden="true">2.2.</strong> Contributing</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="contribution-guide/NO-CODE.html"><strong aria-hidden="true">2.3.</strong> No Code</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="contribution-guide/PR.html"><strong aria-hidden="true">2.4.</strong> Pr</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="contribution-guide/TRANSLATION-GUIDE.html"><strong aria-hidden="true">2.5.</strong> Translation Guide</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="contribution-guide/contributors.html"><strong aria-hidden="true">2.6.</strong> Contributors</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/index.html"><strong aria-hidden="true">3.</strong> Interview Qna</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/index.html"><strong aria-hidden="true">3.1.</strong> Class Wise</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang007-hello-world/index.html"><strong aria-hidden="true">3.1.1.</strong> Golang007 Hello World</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang008-Variables-and-Data-Types/index.html"><strong aria-hidden="true">3.1.2.</strong> Golang008 Variables And Data Types</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang009-If-else-and-switch/index.html"><strong aria-hidden="true">3.1.3.</strong> Golang009 If Else And Switch</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang010-Introduction-to-Functions/index.html"><strong aria-hidden="true">3.1.4.</strong> Golang010 Introduction To Functions</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang011-Function-with-Return-Values-and-Types/index.html"><strong aria-hidden="true">3.1.5.</strong> Golang011 Function With Return Values And Types</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang012-More-Function-Examples/index.html"><strong aria-hidden="true">3.1.6.</strong> Golang012 More Function Examples</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang013-Why-Functions-Are-Needed/index.html"><strong aria-hidden="true">3.1.7.</strong> Golang013 Why Functions Are Needed</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang014-what-is-scope/index.html"><strong aria-hidden="true">3.1.8.</strong> Golang014 What Is Scope</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang015-Local-Scope-and-Block/index.html"><strong aria-hidden="true">3.1.9.</strong> Golang015 Local Scope And Block</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang016-package-scope/index.html"><strong aria-hidden="true">3.1.10.</strong> Golang016 Package Scope</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang017-scope-example/index.html"><strong aria-hidden="true">3.1.11.</strong> Golang017 Scope Example</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang018-variable-shadowing/index.html"><strong aria-hidden="true">3.1.12.</strong> Golang018 Variable Shadowing</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang019-function-types/index.html"><strong aria-hidden="true">3.1.13.</strong> Golang019 Function Types</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang020-init-function/index.html"><strong aria-hidden="true">3.1.14.</strong> Golang020 Init Function</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang021-anonymous-func-and-iife/index.html"><strong aria-hidden="true">3.1.15.</strong> Golang021 Anonymous Func And Iife</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang022-function-expression-example/index.html"><strong aria-hidden="true">3.1.16.</strong> Golang022 Function Expression Example</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang023-fof-vs-hof/index.html"><strong aria-hidden="true">3.1.17.</strong> Golang023 Fof Vs Hof</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang024-internal-memory/index.html"><strong aria-hidden="true">3.1.18.</strong> Golang024 Internal Memory</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang025-end_of_internal-memory/index.html"><strong aria-hidden="true">3.1.19.</strong> Golang025 End Of Internal Memory</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang026-closure/index.html"><strong aria-hidden="true">3.1.20.</strong> Golang026 Closure</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang027-struct/index.html"><strong aria-hidden="true">3.1.21.</strong> Golang027 Struct</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang028-receiver-function/index.html"><strong aria-hidden="true">3.1.22.</strong> Golang028 Receiver Function</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang029-array/index.html"><strong aria-hidden="true">3.1.23.</strong> Golang029 Array</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang030-pointers/index.html"><strong aria-hidden="true">3.1.24.</strong> Golang030 Pointers</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang031-slice/index.html"><strong aria-hidden="true">3.1.25.</strong> Golang031 Slice</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang032-Computer-Architecture-and-History/index.html"><strong aria-hidden="true">3.1.26.</strong> Golang032 Computer Architecture And History</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang033-Into-the-operating-system/index.html"><strong aria-hidden="true">3.1.27.</strong> Golang033 Into The Operating System</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang034-breaking-the-cpu-and-process/index.html"><strong aria-hidden="true">3.1.28.</strong> Golang034 Breaking The Cpu And Process</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang035-BP-SP/index.html"><strong aria-hidden="true">3.1.29.</strong> Golang035 Bp Sp</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang036-Context-Switching-PCB-Concurrency/index.html"><strong aria-hidden="true">3.1.30.</strong> Golang036 Context Switching Pcb Concurrency</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang037-concurrency-vs-parallelism/index.html"><strong aria-hidden="true">3.1.31.</strong> Golang037 Concurrency Vs Parallelism</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang038-thread/index.html"><strong aria-hidden="true">3.1.32.</strong> Golang038 Thread</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang039-vogus-data-types/index.html"><strong aria-hidden="true">3.1.33.</strong> Golang039 Vogus Data Types</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang040-defer-never-before/index.html"><strong aria-hidden="true">3.1.34.</strong> Golang040 Defer Never Before</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang041-thread-has-stack/index.html"><strong aria-hidden="true">3.1.35.</strong> Golang041 Thread Has Stack</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang042-complex-and-beautiful-goroutine/index.html"><strong aria-hidden="true">3.1.36.</strong> Golang042 Complex And Beautiful Goroutine</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang043-into-the-backend-development/index.html"><strong aria-hidden="true">3.1.37.</strong> Golang043 Into The Backend Development</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/class-wise/golang046-go-runtime/index.html"><strong aria-hidden="true">3.1.38.</strong> Golang046 Go Runtime</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/topic-wise/index.html"><strong aria-hidden="true">3.2.</strong> Topic Wise</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/topic-wise/array.html"><strong aria-hidden="true">3.2.1.</strong> Array</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/topic-wise/boolean.html"><strong aria-hidden="true">3.2.2.</strong> Boolean</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/topic-wise/callback-func.html"><strong aria-hidden="true">3.2.3.</strong> Callback Func</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/topic-wise/closures.html"><strong aria-hidden="true">3.2.4.</strong> Closures</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/topic-wise/comparison-operator.html"><strong aria-hidden="true">3.2.5.</strong> Comparison Operator</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/topic-wise/conditional-statement.html"><strong aria-hidden="true">3.2.6.</strong> Conditional Statement</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/topic-wise/constant.html"><strong aria-hidden="true">3.2.7.</strong> Constant</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/topic-wise/defer.html"><strong aria-hidden="true">3.2.8.</strong> Defer</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/topic-wise/go-routine.html"><strong aria-hidden="true">3.2.9.</strong> Go Routine</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/topic-wise/higher&first-order-func.html"><strong aria-hidden="true">3.2.10.</strong> Higher&amp;first Order Func</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/topic-wise/iife-func.html"><strong aria-hidden="true">3.2.11.</strong> Iife Func</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/topic-wise/internal-memory.html"><strong aria-hidden="true">3.2.12.</strong> Internal Memory</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/topic-wise/logical-operator.html"><strong aria-hidden="true">3.2.13.</strong> Logical Operator</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/topic-wise/loops.html"><strong aria-hidden="true">3.2.14.</strong> Loops</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/topic-wise/maps.html"><strong aria-hidden="true">3.2.15.</strong> Maps</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/topic-wise/numbers.html"><strong aria-hidden="true">3.2.16.</strong> Numbers</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/topic-wise/parameter-argument.html"><strong aria-hidden="true">3.2.17.</strong> Parameter Argument</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/topic-wise/pointer.html"><strong aria-hidden="true">3.2.18.</strong> Pointer</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/topic-wise/receiver-function.html"><strong aria-hidden="true">3.2.19.</strong> Receiver Function</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/topic-wise/scope.html"><strong aria-hidden="true">3.2.20.</strong> Scope</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/topic-wise/slice.html"><strong aria-hidden="true">3.2.21.</strong> Slice</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/topic-wise/string.html"><strong aria-hidden="true">3.2.22.</strong> String</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/topic-wise/struct.html"><strong aria-hidden="true">3.2.23.</strong> Struct</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/topic-wise/switch-statement.html"><strong aria-hidden="true">3.2.24.</strong> Switch Statement</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/topic-wise/variable.html"><strong aria-hidden="true">3.2.25.</strong> Variable</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="interview-qna/topic-wise/variadic-function.html"><strong aria-hidden="true">3.2.26.</strong> Variadic Function</a></span></li></ol></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="link-resources/index.html"><strong aria-hidden="true">4.</strong> Link Resources</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><span><strong aria-hidden="true">5.</strong> Low Level</span></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="low-level/global-vars-memory.html"><strong aria-hidden="true">5.1.</strong> Global Vars Memory</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="mini-projects/index.html"><strong aria-hidden="true">6.</strong> Mini Projects</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="mini-projects/Quantique/index.html"><strong aria-hidden="true">6.1.</strong> Quantique</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="mini-projects/cards/index.html"><strong aria-hidden="true">6.2.</strong> Cards</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="mini-projects/ccwc/index.html"><strong aria-hidden="true">6.3.</strong> Ccwc</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="mini-projects/git-pulse/index.html"><strong aria-hidden="true">6.4.</strong> Git Pulse</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="mini-projects/jsonparser/index.html"><strong aria-hidden="true">6.5.</strong> Jsonparser</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="mini-projects/program-counter/index.html"><strong aria-hidden="true">6.6.</strong> Program Counter</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="mini-projects/rock-paper-scissors/index.html"><strong aria-hidden="true">6.7.</strong> Rock Paper Scissors</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="mini-projects/test-server/index.html"><strong aria-hidden="true">6.8.</strong> Test Server</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="mini-projects/todo-cli/index.html"><strong aria-hidden="true">6.9.</strong> Todo Cli</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="mini-projects/udp-c/index.html"><strong aria-hidden="true">6.10.</strong> Udp C</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="mini-projects/udp-js/index.html"><strong aria-hidden="true">6.11.</strong> Udp Js</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="mini-projects/url-shortner/index.html"><strong aria-hidden="true">6.12.</strong> Url Shortner</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><span><strong aria-hidden="true">7.</strong> Warp</span></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="warp/cp-guide.html"><strong aria-hidden="true">7.1.</strong> Cp Guide</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="warp/cp-session-log.html"><strong aria-hidden="true">7.2.</strong> Cp Session Log</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="warp/roadmap.html"><strong aria-hidden="true">7.3.</strong> Roadmap</a></span></li></ol></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split('#')[0].split('?')[0];
        if (current_page.endsWith('/')) {
            current_page += 'index.html';
        }
        const links = Array.prototype.slice.call(this.querySelectorAll('a'));
        const l = links.length;
        for (let i = 0; i < l; ++i) {
            const link = links[i];
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The 'index' page is supposed to alias the first chapter in the book.
            if (link.href === current_page
                || i === 0
                && path_to_root === ''
                && current_page.endsWith('/index.html')) {
                link.classList.add('active');
                let parent = link.parentElement;
                while (parent) {
                    if (parent.tagName === 'LI' && parent.classList.contains('chapter-item')) {
                        parent.classList.add('expanded');
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', e => {
            if (e.target.tagName === 'A') {
                const clientRect = e.target.getBoundingClientRect();
                const sidebarRect = this.getBoundingClientRect();
                sessionStorage.setItem('sidebar-scroll-offset', clientRect.top - sidebarRect.top);
            }
        }, { passive: true });
        const sidebarScrollOffset = sessionStorage.getItem('sidebar-scroll-offset');
        sessionStorage.removeItem('sidebar-scroll-offset');
        if (sidebarScrollOffset !== null) {
            // preserve sidebar scroll position when navigating via links within sidebar
            const activeSection = this.querySelector('.active');
            if (activeSection) {
                const clientRect = activeSection.getBoundingClientRect();
                const sidebarRect = this.getBoundingClientRect();
                const currentOffset = clientRect.top - sidebarRect.top;
                this.scrollTop += currentOffset - parseFloat(sidebarScrollOffset);
            }
        } else {
            // scroll sidebar to current active section when navigating via
            // 'next/previous chapter' buttons
            const activeSection = document.querySelector('#mdbook-sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        const sidebarAnchorToggles = document.querySelectorAll('.chapter-fold-toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(el => {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define('mdbook-sidebar-scrollbox', MDBookSidebarScrollbox);


// ---------------------------------------------------------------------------
// Support for dynamically adding headers to the sidebar.

(function() {
    // This is used to detect which direction the page has scrolled since the
    // last scroll event.
    let lastKnownScrollPosition = 0;
    // This is the threshold in px from the top of the screen where it will
    // consider a header the "current" header when scrolling down.
    const defaultDownThreshold = 150;
    // Same as defaultDownThreshold, except when scrolling up.
    const defaultUpThreshold = 300;
    // The threshold is a virtual horizontal line on the screen where it
    // considers the "current" header to be above the line. The threshold is
    // modified dynamically to handle headers that are near the bottom of the
    // screen, and to slightly offset the behavior when scrolling up vs down.
    let threshold = defaultDownThreshold;
    // This is used to disable updates while scrolling. This is needed when
    // clicking the header in the sidebar, which triggers a scroll event. It
    // is somewhat finicky to detect when the scroll has finished, so this
    // uses a relatively dumb system of disabling scroll updates for a short
    // time after the click.
    let disableScroll = false;
    // Array of header elements on the page.
    let headers;
    // Array of li elements that are initially collapsed headers in the sidebar.
    // I'm not sure why eslint seems to have a false positive here.
    // eslint-disable-next-line prefer-const
    let headerToggles = [];
    // This is a debugging tool for the threshold which you can enable in the console.
    let thresholdDebug = false;

    // Updates the threshold based on the scroll position.
    function updateThreshold() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // The number of pixels below the viewport, at most documentHeight.
        // This is used to push the threshold down to the bottom of the page
        // as the user scrolls towards the bottom.
        const pixelsBelow = Math.max(0, documentHeight - (scrollTop + windowHeight));
        // The number of pixels above the viewport, at least defaultDownThreshold.
        // Similar to pixelsBelow, this is used to push the threshold back towards
        // the top when reaching the top of the page.
        const pixelsAbove = Math.max(0, defaultDownThreshold - scrollTop);
        // How much the threshold should be offset once it gets close to the
        // bottom of the page.
        const bottomAdd = Math.max(0, windowHeight - pixelsBelow - defaultDownThreshold);
        let adjustedBottomAdd = bottomAdd;

        // Adjusts bottomAdd for a small document. The calculation above
        // assumes the document is at least twice the windowheight in size. If
        // it is less than that, then bottomAdd needs to be shrunk
        // proportional to the difference in size.
        if (documentHeight < windowHeight * 2) {
            const maxPixelsBelow = documentHeight - windowHeight;
            const t = 1 - pixelsBelow / Math.max(1, maxPixelsBelow);
            const clamp = Math.max(0, Math.min(1, t));
            adjustedBottomAdd *= clamp;
        }

        let scrollingDown = true;
        if (scrollTop < lastKnownScrollPosition) {
            scrollingDown = false;
        }

        if (scrollingDown) {
            // When scrolling down, move the threshold up towards the default
            // downwards threshold position. If near the bottom of the page,
            // adjustedBottomAdd will offset the threshold towards the bottom
            // of the page.
            const amountScrolledDown = scrollTop - lastKnownScrollPosition;
            const adjustedDefault = defaultDownThreshold + adjustedBottomAdd;
            threshold = Math.max(adjustedDefault, threshold - amountScrolledDown);
        } else {
            // When scrolling up, move the threshold down towards the default
            // upwards threshold position. If near the bottom of the page,
            // quickly transition the threshold back up where it normally
            // belongs.
            const amountScrolledUp = lastKnownScrollPosition - scrollTop;
            const adjustedDefault = defaultUpThreshold - pixelsAbove
                + Math.max(0, adjustedBottomAdd - defaultDownThreshold);
            threshold = Math.min(adjustedDefault, threshold + amountScrolledUp);
        }

        if (documentHeight <= windowHeight) {
            threshold = 0;
        }

        if (thresholdDebug) {
            const id = 'mdbook-threshold-debug-data';
            let data = document.getElementById(id);
            if (data === null) {
                data = document.createElement('div');
                data.id = id;
                data.style.cssText = `
                    position: fixed;
                    top: 50px;
                    right: 10px;
                    background-color: 0xeeeeee;
                    z-index: 9999;
                    pointer-events: none;
                `;
                document.body.appendChild(data);
            }
            data.innerHTML = `
                <table>
                  <tr><td>documentHeight</td><td>${documentHeight.toFixed(1)}</td></tr>
                  <tr><td>windowHeight</td><td>${windowHeight.toFixed(1)}</td></tr>
                  <tr><td>scrollTop</td><td>${scrollTop.toFixed(1)}</td></tr>
                  <tr><td>pixelsAbove</td><td>${pixelsAbove.toFixed(1)}</td></tr>
                  <tr><td>pixelsBelow</td><td>${pixelsBelow.toFixed(1)}</td></tr>
                  <tr><td>bottomAdd</td><td>${bottomAdd.toFixed(1)}</td></tr>
                  <tr><td>adjustedBottomAdd</td><td>${adjustedBottomAdd.toFixed(1)}</td></tr>
                  <tr><td>scrollingDown</td><td>${scrollingDown}</td></tr>
                  <tr><td>threshold</td><td>${threshold.toFixed(1)}</td></tr>
                </table>
            `;
            drawDebugLine();
        }

        lastKnownScrollPosition = scrollTop;
    }

    function drawDebugLine() {
        if (!document.body) {
            return;
        }
        const id = 'mdbook-threshold-debug-line';
        const existingLine = document.getElementById(id);
        if (existingLine) {
            existingLine.remove();
        }
        const line = document.createElement('div');
        line.id = id;
        line.style.cssText = `
            position: fixed;
            top: ${threshold}px;
            left: 0;
            width: 100vw;
            height: 2px;
            background-color: red;
            z-index: 9999;
            pointer-events: none;
        `;
        document.body.appendChild(line);
    }

    function mdbookEnableThresholdDebug() {
        thresholdDebug = true;
        updateThreshold();
        drawDebugLine();
    }

    window.mdbookEnableThresholdDebug = mdbookEnableThresholdDebug;

    // Updates which headers in the sidebar should be expanded. If the current
    // header is inside a collapsed group, then it, and all its parents should
    // be expanded.
    function updateHeaderExpanded(currentA) {
        // Add expanded to all header-item li ancestors.
        let current = currentA.parentElement;
        while (current) {
            if (current.tagName === 'LI' && current.classList.contains('header-item')) {
                current.classList.add('expanded');
            }
            current = current.parentElement;
        }
    }

    // Updates which header is marked as the "current" header in the sidebar.
    // This is done with a virtual Y threshold, where headers at or below
    // that line will be considered the current one.
    function updateCurrentHeader() {
        if (!headers || !headers.length) {
            return;
        }

        // Reset the classes, which will be rebuilt below.
        const els = document.getElementsByClassName('current-header');
        for (const el of els) {
            el.classList.remove('current-header');
        }
        for (const toggle of headerToggles) {
            toggle.classList.remove('expanded');
        }

        // Find the last header that is above the threshold.
        let lastHeader = null;
        for (const header of headers) {
            const rect = header.getBoundingClientRect();
            if (rect.top <= threshold) {
                lastHeader = header;
            } else {
                break;
            }
        }
        if (lastHeader === null) {
            lastHeader = headers[0];
            const rect = lastHeader.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            if (rect.top >= windowHeight) {
                return;
            }
        }

        // Get the anchor in the summary.
        const href = '#' + lastHeader.id;
        const a = [...document.querySelectorAll('.header-in-summary')]
            .find(element => element.getAttribute('href') === href);
        if (!a) {
            return;
        }

        a.classList.add('current-header');

        updateHeaderExpanded(a);
    }

    // Updates which header is "current" based on the threshold line.
    function reloadCurrentHeader() {
        if (disableScroll) {
            return;
        }
        updateThreshold();
        updateCurrentHeader();
    }


    // When clicking on a header in the sidebar, this adjusts the threshold so
    // that it is located next to the header. This is so that header becomes
    // "current".
    function headerThresholdClick(event) {
        // See disableScroll description why this is done.
        disableScroll = true;
        setTimeout(() => {
            disableScroll = false;
        }, 100);
        // requestAnimationFrame is used to delay the update of the "current"
        // header until after the scroll is done, and the header is in the new
        // position.
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // Closest is needed because if it has child elements like <code>.
                const a = event.target.closest('a');
                const href = a.getAttribute('href');
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    threshold = targetElement.getBoundingClientRect().bottom;
                    updateCurrentHeader();
                }
            });
        });
    }

    // Takes the nodes from the given head and copies them over to the
    // destination, along with some filtering.
    function filterHeader(source, dest) {
        const clone = source.cloneNode(true);
        clone.querySelectorAll('mark').forEach(mark => {
            mark.replaceWith(...mark.childNodes);
        });
        dest.append(...clone.childNodes);
    }

    // Scans page for headers and adds them to the sidebar.
    document.addEventListener('DOMContentLoaded', function() {
        const activeSection = document.querySelector('#mdbook-sidebar .active');
        if (activeSection === null) {
            return;
        }

        const main = document.getElementsByTagName('main')[0];
        headers = Array.from(main.querySelectorAll('h2, h3, h4, h5, h6'))
            .filter(h => h.id !== '' && h.children.length && h.children[0].tagName === 'A');

        if (headers.length === 0) {
            return;
        }

        // Build a tree of headers in the sidebar.

        const stack = [];

        const firstLevel = parseInt(headers[0].tagName.charAt(1));
        for (let i = 1; i < firstLevel; i++) {
            const ol = document.createElement('ol');
            ol.classList.add('section');
            if (stack.length > 0) {
                stack[stack.length - 1].ol.appendChild(ol);
            }
            stack.push({level: i + 1, ol: ol});
        }

        // The level where it will start folding deeply nested headers.
        const foldLevel = 3;

        for (let i = 0; i < headers.length; i++) {
            const header = headers[i];
            const level = parseInt(header.tagName.charAt(1));

            const currentLevel = stack[stack.length - 1].level;
            if (level > currentLevel) {
                // Begin nesting to this level.
                for (let nextLevel = currentLevel + 1; nextLevel <= level; nextLevel++) {
                    const ol = document.createElement('ol');
                    ol.classList.add('section');
                    const last = stack[stack.length - 1];
                    const lastChild = last.ol.lastChild;
                    // Handle the case where jumping more than one nesting
                    // level, which doesn't have a list item to place this new
                    // list inside of.
                    if (lastChild) {
                        lastChild.appendChild(ol);
                    } else {
                        last.ol.appendChild(ol);
                    }
                    stack.push({level: nextLevel, ol: ol});
                }
            } else if (level < currentLevel) {
                while (stack.length > 1 && stack[stack.length - 1].level > level) {
                    stack.pop();
                }
            }

            const li = document.createElement('li');
            li.classList.add('header-item');
            li.classList.add('expanded');
            if (level < foldLevel) {
                li.classList.add('expanded');
            }
            const span = document.createElement('span');
            span.classList.add('chapter-link-wrapper');
            const a = document.createElement('a');
            span.appendChild(a);
            a.href = '#' + header.id;
            a.classList.add('header-in-summary');
            filterHeader(header.children[0], a);
            a.addEventListener('click', headerThresholdClick);
            const nextHeader = headers[i + 1];
            if (nextHeader !== undefined) {
                const nextLevel = parseInt(nextHeader.tagName.charAt(1));
                if (nextLevel > level && level >= foldLevel) {
                    const toggle = document.createElement('a');
                    toggle.classList.add('chapter-fold-toggle');
                    toggle.classList.add('header-toggle');
                    toggle.addEventListener('click', () => {
                        li.classList.toggle('expanded');
                    });
                    const toggleDiv = document.createElement('div');
                    toggleDiv.textContent = '❱';
                    toggle.appendChild(toggleDiv);
                    span.appendChild(toggle);
                    headerToggles.push(li);
                }
            }
            li.appendChild(span);

            const currentParent = stack[stack.length - 1];
            currentParent.ol.appendChild(li);
        }

        const onThisPage = document.createElement('div');
        onThisPage.classList.add('on-this-page');
        onThisPage.append(stack[0].ol);
        const activeItemSpan = activeSection.parentElement;
        activeItemSpan.after(onThisPage);
    });

    document.addEventListener('DOMContentLoaded', reloadCurrentHeader);
    document.addEventListener('scroll', reloadCurrentHeader, { passive: true });
})();

