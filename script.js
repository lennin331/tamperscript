// ==UserScript==
// @name         CTF Highlighter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @match        http://127.0.0.1:5500/*
// @match        file:///*.html
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const colors = ["red", "red", "red", "red", "red", "red", "red", "red", "red"];
     

         const container = document.getElementById("p1");
        if (!container) return;

        // Store original HTML structure
        const originalHTML = container.innerHTML;

        // Create a temporary div to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = originalHTML;

        
        function highlightTextNodes(node, currentPos) {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                if (!text.trim()) return currentPos;

                let newContent = '';
                let localPos = 0;
                const positions = [17,92,338,695,833,1192,1599,1810,2250];
                for (let i = 0; i < text.length; i++) {
                    if (positions.includes(currentPos + localPos)) {
                        const colorIndex = positions.indexOf(currentPos + localPos);
                        newContent += `<span style="color:${colors[colorIndex]}; font-weight:bold;">${text[i]}</span>`;
                    } else {
                        newContent += text[i];
                    }
                    localPos++;
                }

                // Replace text node with span containing highlighted text
                const span = document.createElement('span');
                span.innerHTML = newContent;
                node.parentNode.replaceChild(span, node);

                return currentPos + text.length;
            } else {
                // Process child nodes
                const children = Array.from(node.childNodes);
                for (let child of children) {
                    currentPos = highlightTextNodes(child, currentPos);
                }
                return currentPos;
            }
        }

        // Start traversal from container
        highlightTextNodes(container, 0);

})();
