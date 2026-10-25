/**
 * ToolMatic - Main Site JavaScript
 * Handles navigation, FAQ accordions, copy buttons, tabs, and analytics initialization
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // 1. Mobile Menu Toggle
  const navbarToggle = document.querySelector('.navbar-toggle');
  const navbarMenu = document.querySelector('.navbar-menu');

  if (navbarToggle && navbarMenu) {
    navbarToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      navbarToggle.classList.toggle('active');
      navbarMenu.classList.toggle('open');
    });

    document.addEventListener('click', function (e) {
      if (!navbarMenu.contains(e.target) && !navbarToggle.contains(e.target)) {
        navbarToggle.classList.remove('active');
        navbarMenu.classList.remove('open');
      }
    });

    navbarMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navbarToggle.classList.remove('active');
        navbarMenu.classList.remove('open');
      });
    });
  }

  // 2. FAQ Accordions (AEO / Voice Search UX)
  const faqHeaders = document.querySelectorAll('.faq-header');
  faqHeaders.forEach(function (header) {
    header.addEventListener('click', function () {
      const card = header.closest('.faq-card');
      if (!card) return;
      const body = card.querySelector('.faq-body');
      const icon = card.querySelector('.faq-icon');

      const isOpen = body && body.classList.contains('open');

      // Toggle current
      if (body) body.classList.toggle('open', !isOpen);
      if (icon) icon.classList.toggle('open', !isOpen);
    });
  });

  // 3. Copy to Clipboard
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const targetId = btn.getAttribute('data-target');
      const targetElem = document.getElementById(targetId);
      if (!targetElem) return;

      const text = targetElem.value !== undefined ? targetElem.value : targetElem.innerText;
      if (!text) return;

      navigator.clipboard.writeText(text).then(function () {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>Copied ✓</span>';
        btn.classList.add('btn-copied');

        setTimeout(function () {
          btn.innerHTML = originalText;
          btn.classList.remove('btn-copied');
        }, 2000);
      }).catch(function (err) {
        console.error('Copy failed:', err);
      });
    });
  });

  // 4. Tabs
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const tabGroup = tab.closest('.tabs-container');
      if (!tabGroup) return;

      const targetTabId = tab.getAttribute('data-tab');
      tabGroup.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
      tabGroup.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const pane = document.getElementById(targetTabId);
      if (pane) pane.classList.add('active');
    });
  });
});
