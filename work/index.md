---
layout: page
title: All Student Work
---

<article class="work">
  {% for student in collections.students %}
  <section>
    <a href="/work/{{ student.folder }}/">
      <img src="/work/{{ student.folder }}/{{ student.featured }}">
    </a>
    <h2>{{ student.name }}</h2>
  </section>
  {% endfor %}
</article>
