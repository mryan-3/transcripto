# Transcripto - Mini PRD

## Overview

Transcripto is a personal AI assistant for recorded client meetings that transforms raw recordings into searchable knowledge, summaries, action items, and project requirements.

The goal is to eliminate the manual process of reviewing recordings, re-reading transcripts, and searching for specific details after client calls. Instead, users should be able to upload a meeting recording and receive structured insights and interact with the meeting through a conversational interface.

This project also serves as a practical learning platform for Retrieval-Augmented Generation (RAG), document processing pipelines, and AI-powered knowledge systems.

---

# Problem Statement

Current workflow:

1. Record meetings using OBS.
2. Extract audio manually.
3. Generate transcripts.
4. Review transcripts.
5. Rewatch portions of meetings to verify details.
6. Manually create summaries, requirements, and action items.

This process is time-consuming, repetitive, and makes it difficult to retrieve information from previous conversations.

The objective is to reduce this entire workflow into an automated, searchable experience.

---

# Goals

The product should enable users to:

* Upload recorded meetings.
* Automatically generate transcripts.
* Extract project requirements and action items.
* Produce concise meeting summaries.
* Identify unresolved questions or ambiguities.
* Search and chat with meeting content.
* Navigate to relevant timestamps within recordings.
* Build a personal knowledge base across multiple client meetings.

---

# User Story

As a freelance developer,

I want to upload my recorded client meetings,

So that I can quickly understand requirements, revisit decisions, extract tasks, and ask questions about previous conversations without manually reviewing recordings.

---

# Core User Flow

```text
Meeting Ends
↓

Upload Recording

↓

Processing Pipeline Starts

↓

Audio Extraction

↓

Speech-to-Text Transcription

↓

Transcript Chunking

↓

Embedding Generation

↓

Knowledge Storage

↓

AI Analysis
- Summary
- Requirements
- Action Items
- Open Questions

↓

Meeting Dashboard

↓

Chat With Meeting
```

---

# Product Features

## 1. Meeting Upload

Users can upload a recorded meeting file.

Expected outcome:

* Meeting is saved
* Processing begins automatically
* User receives processing status updates

---

## 2. Transcript Generation

The system converts meeting audio into a timestamped transcript.

Expected outcome:

* Full transcript available
* Speaker information when possible
* Timestamps attached to transcript sections

---

## 3. Meeting Intelligence

The system automatically extracts structured insights.

Generated outputs:

### Summary

A concise overview of the discussion.

Example:

* Project goals
* Major decisions
* Key concerns

---

### Action Items

Tasks assigned during the meeting.

Categories:

* User responsibilities
* Client responsibilities

---

### Requirements

Potential software requirements identified from discussions.

Examples:

* Authentication requirements
* Export functionality
* User management features
* Integrations

---

### Open Questions

Items requiring further clarification.

Examples:

* Budget considerations
* Hosting preferences
* User volume expectations

---

## 4. Search and Chat

Users can ask natural language questions about previous meetings.

Examples:

> What authentication method did the client request?

> When did we discuss deployment?

> What action items were assigned to me?

The system should retrieve relevant transcript sections and generate responses grounded in meeting content.

---

## 5. Timestamp Navigation

Generated insights and chat responses should reference meeting timestamps.

Users should be able to quickly locate relevant sections within recordings without manually searching.

---

# High-Level Architecture

The product consists of four major components:

## User Interface

Responsible for:

* Uploading meetings
* Viewing summaries
* Reading transcripts
* Chatting with meetings
* Tracking processing progress

---

## Processing Pipeline

Responsible for:

* Audio extraction
* Transcription
* Transcript preparation
* AI analysis

---

## Knowledge Layer

Responsible for:

* Chunking transcripts
* Creating embeddings
* Storing searchable meeting knowledge
* Supporting retrieval operations

---

## AI Layer

Responsible for:

* Summarization
* Requirement extraction
* Action item generation
* Conversational querying

---

# Phase Breakdown

## Phase 1: Meeting Processing MVP

Goal:

Convert recordings into structured meeting information.

Features:

* Upload meeting recordings
* Automatic transcription
* Full transcript viewing
* AI-generated summaries
* Action item extraction
* Requirement extraction
* Open question generation

Success criteria:

A user can upload a recording and receive complete meeting notes without additional manual work.

---

## Phase 2: RAG Integration

Goal:

Turn meetings into a searchable knowledge base.

Features:

* Transcript chunking
* Embedding generation
* Vector search
* Natural language querying
* Source attribution
* Timestamp references

Success criteria:

Users can ask questions about meetings and receive accurate, context-aware answers grounded in transcript content.

---

## Phase 3: Meeting Knowledge Hub

Goal:

Support multiple meetings and long-term knowledge retention.

Features:

* Meeting dashboard
* Search across meetings
* Project grouping
* Historical conversation retrieval
* Cross-meeting insights

Success criteria:

Users can treat all previous client meetings as a persistent, searchable knowledge system.

---

## Phase 4: Workflow Automation

Goal:

Reduce manual interaction as much as possible.

Features:

* Automatic processing of new recordings
* Background processing pipelines
* Notifications when analysis is complete
* Export to markdown or task management tools
* Integration with project workflows

Success criteria:

The entire meeting-to-insights process becomes largely automatic with minimal user intervention.

---

# Future Opportunities

Potential future enhancements include:

* Speaker identification
* Real-time meeting transcription
* Integration with video conferencing platforms
* Automatic ticket generation
* Project proposal generation
* Requirement specification documents
* Meeting sentiment analysis
* Team collaboration features

---

# Definition of Success

Transcripto is successful when a user can finish a client call, upload a recording, and immediately receive:

* A complete transcript
* A concise summary
* Action items
* Requirements
* Open questions
* A conversational interface for retrieving information later

The system should eliminate the need to manually rewatch recordings or search through large transcript files.
