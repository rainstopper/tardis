---
home: true
title: 首页
---

<div style="height: 60vh; min-height: 500px">
  <KnowledgeGraphAsync
    title="知识图谱"
    url="/data/knowledge.json"
    :force="{ edgeLength: 30, repulsion: 25, gravity: 0.12 }"
  />
</div>
