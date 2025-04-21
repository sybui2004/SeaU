# SeaU API Documentation

## Table of Contents

- [Authentication](#authentication)
- [Users](#users)
- [Search](#search)
- [Posts](#posts)
- [Comments](#comments)
- [Conversations](#conversations)
- [Messages](#messages)
- [File Upload](#file-upload)

## Authentication

### Register

- **URL**: `/auth/register`
- **Method**: `POST`
- **Description**: Register a new user account.
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string",
    "fullname": "string"
  }
  ```
- **Response**: User data and authentication token.

### Login

- **URL**: `/auth/login`
- **Method**: `POST`
- **Description**: Authenticate a user and get access token.
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**: User data and authentication token.

## Users

### Get User

- **URL**: `/user/:id`
- **Method**: `GET`
- **Description**: Get user details by ID.
- **Response**: User information.

### Update User

- **URL**: `/user/:id`
- **Method**: `PUT`
- **Description**: Update user profile information.
- **Request Body**:

  ```json
  {
    "fullname": "string",
    "password": "string",
    "username": "string",
    "profilePic": "string",
    ...

  }
  ```

- **Response**: Updated user information.

### Delete User

- **URL**: `/user/:id`
- **Method**: `DELETE`
- **Description**: Delete a user account.
- **Request Body**:

  ```json
  {
    "currentUserId": "string"
  }
  ```

- **Response**: Success message.

### Friend Requests

#### Send Friend Request

- **URL**: `/user/:id/friend-request`
- **Method**: `POST`
- **Description**: Send a friend request to another user.
- **Request Body**:
  ```json
  {
    "currentUserId": "string"
  }
  ```
- **Response**: Success message.

#### Cancel Friend Request

- **URL**: `/user/:id/friend-request`
- **Method**: `DELETE`
- **Description**: Cancel a pending friend request.
- **Request Body**:
  ```json
  {
    "currentUserId": "string"
  }
  ```
- **Response**: Success message.

#### Accept Friend Request

- **URL**: `/user/:id/accept`
- **Method**: `POST`
- **Description**: Accept a friend request.
- **Request Body**:
  ```json
  {
    "currentUserId": "string"
  }
  ```
- **Response**: Success message.

#### Reject Friend Request

- **URL**: `/user/:id/reject`
- **Method**: `POST`
- **Description**: Reject a friend request.
- **Request Body**:
  ```json
  {
    "currentUserId": "string"
  }
  ```
- **Response**: Success message.

#### Unfriend User

- **URL**: `/user/:id/unfriend`
- **Method**: `DELETE`
- **Description**: Remove a user from friends list.
- **Request Body**:
  ```json
  {
    "currentUserId": "string"
  }
  ```
- **Response**: Success message.

## Search

### Search All

- **URL**: `/search`
- **Method**: `GET`
- **Description**: Search for both users and posts.
- **Query Parameters**:
  - `q`: Search query string
- **Response**: List of matching users and posts.

### Search Users

- **URL**: `/search/users`
- **Method**: `GET`
- **Description**: Search only for users.
- **Query Parameters**:
  - `q`: Search query string
- **Response**: List of matching users.

## Posts

### Create Post

- **URL**: `/post`
- **Method**: `POST`
- **Description**: Create a new post.
- **Request Body**:
  ```json
  {
    "userId": "string",
    "content": "string",
    "image": "string"
  }
  ```
- **Response**: Created post data.

### Get Post

- **URL**: `/post/:id`
- **Method**: `GET`
- **Description**: Get a specific post by ID.
- **Response**: Post data.

### Update Post

- **URL**: `/post/:id`
- **Method**: `PUT`
- **Description**: Update an existing post.
- **Request Body**:
  ```json
  {
    "userId": "string",
    "content": "string",
    "image": "string"
  }
  ```
- **Response**: Updated post data.

### Delete Post

- **URL**: `/post/:id`
- **Method**: `DELETE`
- **Description**: Delete a post.
- **Request Body**:
  ```json
  {
    "userId": "string"
  }
  ```
- **Response**: Success message.

### Like Post

- **URL**: `/post/:id/like`
- **Method**: `PUT`
- **Description**: Like or unlike a post.
- **Request Body**:
  ```json
  {
    "userId": "string"
  }
  ```
- **Response**: Success message.

### Get Timeline Posts

- **URL**: `/post/:id/timeline`
- **Method**: `GET`
- **Description**: Get all posts for a user's timeline.
- **Response**: List of posts.

## Comments

### Get Comments by Post ID

- **URL**: `/comment/:postId`
- **Method**: `GET`
- **Description**: Get all comments for a specific post with pagination.
- **Query Parameters**:
  - `page`: Page number
  - `limit`: Number of items per page
- **Response**:
  ```json
  {
    "success": true,
    "message": "Comments fetched successfully",
    "data": {
      "comments": [
        {
          "postId": "string",
          "userId": {
            "fullname": "string",
            "profilePic": "string"
          },
          "content": "string",
          "likes": ["string"],
          "parentId": null,
          "createdAt": "date",
          "updatedAt": "date"
        }
      ],
      "pagination": {
        "currentPage": 1,
        "totalPages": 5,
        "totalItems": 45,
        "hasNextPage": true,
        "hasPrevPage": false
      }
    }
  }
  ```

### Create Comment

- **URL**: `/comment`
- **Method**: `POST`
- **Description**: Create a new comment on a post.
- **Request Body**:
  ```json
  {
    "postId": "string",
    "userId": "string",
    "content": "string"
  }
  ```
- **Response**: Created comment data.

### Update Comment

- **URL**: `/comment/:commentId`
- **Method**: `PUT`
- **Description**: Update an existing comment.
- **Request Body**:
  ```json
  {
    "userId": "string",
    "content": "string"
  }
  ```
- **Response**: Updated comment data.

### Delete Comment

- **URL**: `/comment/:commentId`
- **Method**: `DELETE`
- **Description**: Delete a comment.
- **Request Body**:
  ```json
  {
    "userId": "string"
  }
  ```
- **Response**: Success message.

### Like, Unlike Comment

- **URL**: `/comment/:commentId/like`
- **Method**: `PUT`
- **Description**: Like or unlike a comment.
- **Request Body**:
  ```json
  {
    "userId": "string"
  }
  ```
- **Response**: Success message.

### Get Replies

- **URL**: `/comment/:commentId/replies`
- **Method**: `GET`
- **Description**: Get all replies to a specific comment with pagination.
- **Query Parameters**:
  - `page`: Page number
  - `limit`: Number of items per page
- **Response**:
  ```json
  {
    "success": true,
    "message": "Replies fetched successfully",
    "data": {
      "replies": [
        {
          "postId": "string",
          "userId": {
            "fullname": "string",
            "profilePic": "string"
          },
          "content": "string",
          "likes": ["string"],
          "parentId": "string",
          "createdAt": "date",
          "updatedAt": "date"
        }
      ],
      "pagination": {
        "currentPage": 1,
        "totalPages": 5,
        "totalItems": 45,
        "hasNextPage": true,
        "hasPrevPage": false
      }
    }
  }
  ```

### Create Reply

- **URL**: `/comment/:commentId/reply`
- **Method**: `POST`
- **Description**: Create a reply to a comment.
- **Request Body**:
  ```json
  {
    "postId": "string",
    "userId": "string",
    "content": "string"
  }
  ```
- **Response**: Created reply data.

## Conversations

### Get User Conversations

- **URL**: `/conversation/:userId`
- **Method**: `GET`
- **Description**: Get all conversations for a user.
- **Response**: List of conversations.

### Create Conversation

- **URL**: `/conversation`
- **Method**: `POST`
- **Description**: Create a new one-on-one conversation.
- **Request Body**:
  ```json
  {
    "senderId": "string",
    "receiverId": "string"
  }
  ```
- **Response**: Created conversation data.

### Create Group Chat

- **URL**: `/conversation/group`
- **Method**: `POST`
- **Description**: Create a new group chat.
- **Request Body**:
  ```json
  {
    "name": "string",
    "members": ["string"],
    "admin": "string"
  }
  ```
- **Response**: Created group chat data.

### Delete Conversation

- **URL**: `/conversation/:conversationId`
- **Method**: `DELETE`
- **Description**: Delete a conversation.
- **Request Body**:
  ```json
  {
    "userId": "string",
    "currentUserAdminStatus": "boolean"
  }
  ```
- **Response**: Success message.

### Add User to Group

- **URL**: `/conversation/group/add`
- **Method**: `PUT`
- **Description**: Add a user to a group chat.
- **Request Body**:
  ```json
  {
    "conversationId": "string",
    "userId": "string",
    "adminId": "string"
  }
  ```
- **Response**: Updated group chat data.

### Remove User from Group

- **URL**: `/conversation/group/remove`
- **Method**: `PUT`
- **Description**: Remove a user from a group chat.
- **Request Body**:
  ```json
  {
    "conversationId": "string",
    "userId": "string",
    "adminId": "string"
  }
  ```
- **Response**: Updated group chat data.

### Update Conversation

- **URL**: `/conversation/:conversationId`
- **Method**: `PUT`
- **Description**: Update group chat information.
- **Request Body**:
  ```json
  {
    "groupName": "string",
    "groupAvatar": "string",
    "userId": "string"
  }
  ```
- **Response**: Updated group chat data.

## Messages

### Get Messages

- **URL**: `/message/:conversationId`
- **Method**: `GET`
- **Description**: Get all messages in a conversation.
- **Response**: List of messages.

### Create Message

- **URL**: `/message`
- **Method**: `POST`
- **Description**: Send a new message.
- **Request Body**:
  ```json
  {
    "conversationId": "string",
    "senderId": "string",
    "text": "string",
    "attachments": ["string"]
  }
  ```
- **Response**: Created message data.

### Update Message

- **URL**: `/message/:messageId`
- **Method**: `PUT`
- **Description**: Update a message.
- **Request Body**:
  ```json
  {
    "userId": "string",
    "text": "string"
  }
  ```
- **Response**: Updated message data.

### Delete Message

- **URL**: `/message/:messageId`
- **Method**: `DELETE`
- **Description**: Delete a message.
- **Request Body**:
  ```json
  {
    "userId": "string",
    "currentUserAdminStatus": "string"
  }
  ```
- **Response**: Success message.

## File Upload

### Upload File

- **URL**: `/upload`
- **Method**: `POST`
- **Description**: Upload a file (image).
- **Form Data**:
  - `file`: File to upload
  - `name`: Desired filename
- **Response**: Success message.

## Response Format

All API endpoints return responses in a consistent format:

### Success Response

```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "code": 400
```
