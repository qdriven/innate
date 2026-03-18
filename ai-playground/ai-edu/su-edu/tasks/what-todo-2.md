# What to do 

Current Status:

In current folder, 
1. [aetherviz-master](./aetherviz-master) is a folder to visualize any education topic in a interactive way.
2. [gemini-flashcards-pro](./gemini-flashcards-pro) is a folder to generate flashcards for any education topic.

What I want to do is that:
1. combine these two tools to make a application to visualize any education topic in a interactive way 
2. The application should support 
   - Web
   - Desktop 
   - Mobile
3. The education topic could be updated by user or by updating to a new version
4. the content could be all in text/markdown and in html to support the interactive visualization.
5. topic and content is updated overtime, so if desktop version, all the data should be stored in local storage, and could be updated. 
6. also add tools for run skill to generate flashcards for any education topic,and store them in local storage.

The whole purpose is to making parents and child working together to learn any topic, the actually can teach each other for any topic.

Please create the whole new project in a totally separate folder, and the folder name should be [learn-together](./learn-together),
and also the documents for project overview, design, planning,tasks should be written in this folder.

The tech stack used:
1. Typescript
2. nextjs
3. shacdn-ui
4. almost same as gemini-flashcards-pro, but with nextjs and shacdn-ui
5. for backend service for update, use python fastapi to provide api for update topic and content, or call ai tools to generate contents.