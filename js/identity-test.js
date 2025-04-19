// JavaScript für Identity Test
console.log('identity-test.js geladen');

const TestFramework = {
    results: { identity: [], dom: [], roles: [], functional: [] },
    passed: 0,
    failed: 0,
    total: 0,
    assert(condition, message, category) {
        this.total++;
        const result = { message, passed: !!condition };
        this.results[category].push(result);
        if(result.passed) this.passed++; else this.failed++;
    },
    updateUI() {
        const fillResults = (id, results) => {
            const container = document.getElementById(id);
            if (!container) return;  // Skip if no test-container on current page
            container.innerHTML = '';
            results.forEach(r => {
                const p = document.createElement('p');
                p.textContent = `${r.passed ? '✅' : '❌'} ${r.message}`;
                container.appendChild(p);
            });
        };
        fillResults('identity-test-results', this.results.identity);
        fillResults('dom-test-results', this.results.dom);
        fillResults('roles-test-results', this.results.roles);
        fillResults('func-test-results', this.results.functional);
        const percent = this.total ? Math.round((this.passed / this.total) * 100) : 0;
        const coverage = document.getElementById('coverage-progress');
        const coverageText = document.getElementById('coverage-text');
        if (coverage && coverageText) {
            coverage.value = percent;
            coverageText.textContent = `Abdeckung: ${percent}% (${this.passed}/${this.total})`;
        }
    },
    reset() {
        this.results = { identity: [], dom: [], roles: [], functional: [] };
        this.passed = this.failed = this.total = 0;
    },
    testIdentityWidget() {
        const hasNetlify = typeof window.netlifyIdentity !== 'undefined';
        this.assert(hasNetlify, 'Netlify Identity Widget geladen', 'identity');
        const menu = document.querySelector('[data-netlify-identity-menu]');
        this.assert(!!menu, 'Netlify Identity Menü-Container vorhanden', 'identity');
    },
    testDOMStructure() {
        const nav = document.querySelector('nav');
        this.assert(!!nav, 'Navigationsmenü ist vorhanden', 'dom');
        ['index.html','info.html','account.html','test.html'].forEach(href => {
            const exists = !!document.querySelector(`a[href="${href}"]`);
            this.assert(exists, `Link zu ${href} vorhanden`, 'dom');
        });
        this.assert(!!document.querySelector('header'), 'Header vorhanden', 'dom');
        this.assert(!!document.querySelector('footer'), 'Footer vorhanden', 'dom');
        this.assert(!!document.querySelector('progress#coverage-progress'), 'Fortschrittsbalken vorhanden', 'dom');
    },
    testUserRolesAndPermissions() {
        const accountLink = document.querySelector('a[href="account.html"]');
        this.assert(!!accountLink, 'Account-Link vorhanden', 'roles');
    },
    testFunctionalTests() {
        const hasRedirect = typeof window.redirectAfterLogin === 'function';
        this.assert(hasRedirect, 'Redirect-Logik Funktion vorhanden', 'functional');
    },
    runAllTests() {
        this.reset();
        this.testIdentityWidget();
        this.testDOMStructure();
        this.testUserRolesAndPermissions();
        this.testFunctionalTests();
        this.updateUI();
    }
};

// Events und Initialisierung in eine separate Funktion auslagern
function initTestFramework() {
    const runAllBtn = document.getElementById('run-all-tests');
    if (!runAllBtn) return;  // Nicht auf Testseite
    console.log('Initialisiere Tests...');
    runAllBtn.addEventListener('click', () => TestFramework.runAllTests());
    const runFuncBtn = document.getElementById('run-func-tests');
    if (runFuncBtn) {
        runFuncBtn.addEventListener('click', () => {
            TestFramework.reset();
            TestFramework.testFunctionalTests();
            TestFramework.updateUI();
        });
    }
    TestFramework.runAllTests();
}

// Zeigt Fehler im UI an
function showError(message) {
    const container = document.getElementById('identity-test-results') || document.body;
    const p = document.createElement('p');
    p.style.color = 'red';
    p.textContent = 'Test-Fehler: ' + message;
    container.appendChild(p);
}

// DOMContentLoaded oder sofort, falls schon geladen
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        try {
            initTestFramework();
        } catch (e) {
            console.error(e);
            showError(e.message);
        }
    });
} else {
    try {
        initTestFramework();
    } catch (e) {
        console.error(e);
        showError(e.message);
    }
}
