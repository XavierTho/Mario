---
layout: base
title: Course Outlines
hide: true
---

{% include nav_home.html %}

<style>
  #typed-text {
    font-style: bold;
    text-align: center;
    font-size: 30px;
  }
</style>

<div id="typed-text"></div>

<script>
const textToType = "MARIO OOP: BY XAVIER THOMPSON";
const typingSpeed = 100;

  function typeWriter() {
    const element = document.getElementById('typed-text');
    let i = 0;

    function type() {
      if (i < textToType.length) {
        element.innerHTML += textToType.charAt(i);
        i++;
        setTimeout(type, typingSpeed);
      }
    }

    type();
  }

  document.addEventListener('DOMContentLoaded', typeWriter);
  </script>