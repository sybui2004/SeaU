CREATE TABLE [User] (
  [id] integer PRIMARY KEY IDENTITY(1, 1),
  [firstName] nvarchar(255),
  [lastName] nvarchar(255),
  [email] nvarchar(255),
  [password] nvarchar(255),
  [gender] enum(male,female),
  [dob] date,
  [role] enum(user,admin),
  [profilePic] nvarchar(255),
  [created_at] timestamp,
  [updated_at] timestamp
)
GO

CREATE TABLE [Post] (
  [id] integer PRIMARY KEY,
  [title] nvarchar(255),
  [body] text,
  [banner_image] nvarchar(255),
  [visibility_control] enum(public,private),
  [featured_status] enum(normal,featured),
  [post_date] date,
  [post_time] timestamp,
  [updated_at] timestamp,
  [is_deleted] boolean DEFAULT (false),
  [user_id] integer
)
GO

CREATE TABLE [Like] (
  [id] integer PRIMARY KEY IDENTITY(1, 1),
  [reaction_type] enum(like,love,haha,sad,angry),
  [status] boolean DEFAULT (false),
  [created_at] timestamp,
  [updated_at] timestamp,
  [is_deleted] boolean DEFAULT (false),
  [post_id] integer,
  [user_id] integer
)
GO

CREATE TABLE [Comment] (
  [id] integer PRIMARY KEY IDENTITY(1, 1),
  [content] text,
  [parent_id] integer,
  [is_pinned] boolean DEFAULT (false),
  [is_edited] boolean DEFAULT (false),
  [comment_date] date,
  [comment_time] timestamp,
  [updated_at] timestamp,
  [is_deleted] boolean DEFAULT (false),
  [user_id] integer,
  [post_id] integer
)
GO

CREATE TABLE [Friendship] (
  [id] integer PRIMARY KEY IDENTITY(1, 1),
  [user_id_1] INTEGER,
  [user_id_2] INTEGER,
  [status] ENUM(pending,accepted,declined,blocked),
  [relationship_type] enum(best_friend,dating,married),
  [requested_at] timestamp,
  [accepted_at] timestamp,
  [is_deleted] boolean DEFAULT (false)
)
GO

CREATE TABLE [Conversation] (
  [id] integer PRIMARY KEY IDENTITY(1, 1),
  [title] nvarchar(255),
  [type] enum(direct,group),
  [created_at] timestamp,
  [updated_at] timestamp,
  [is_deleted] boolean DEFAULT (false)
)
GO

CREATE TABLE [Conversation_User] (
  [id] integer PRIMARY KEY IDENTITY(1, 1),
  [conversation_id] integer,
  [user_id] integer,
  [is_admin] boolean,
  [joined_at] timestamp,
  [left_at] timestamp
)
GO

CREATE TABLE [Message] (
  [id] integer PRIMARY KEY IDENTITY(1, 1),
  [conversation_id] integer,
  [sender_id] integer,
  [content] text,
  [message_type] enum(text,image,video,file,audio,shared_post),
  [shared_content_id] integer,
  [created_at] timestamp,
  [updated_at] timestamp,
  [is_deleted] boolean DEFAULT (false)
)
GO

CREATE TABLE [Home_Notification] (
  [id] integer PRIMARY KEY IDENTITY(1, 1),
  [user_id] integer,
  [type] enum(like,comment,friend_request,accepted_request,friend_post),
  [content] text,
  [reference_id] integer,
  [reference_type] nvarchar(255),
  [created_at] timestamp
)
GO

CREATE TABLE [Message_Notification] (
  [id] integer PRIMARY KEY IDENTITY(1, 1),
  [user_id] integer,
  [conversation_id] integer,
  [sender_id] integer,
  [message_id] integer,
  [content] text,
  [is_read] boolean DEFAULT (false),
  [created_at] timestamp
)
GO

CREATE TABLE [User_Setting] (
  [id] integer PRIMARY KEY IDENTITY(1, 1),
  [user_id] integer,
  [theme] enum(light,dark,system) DEFAULT 'system',
  [language] nvarchar(255) DEFAULT 'en'
)
GO

EXEC sp_addextendedproperty
@name = N'Column_Description',
@value = 'Content of the post',
@level0type = N'Schema', @level0name = 'dbo',
@level1type = N'Table',  @level1name = 'Post',
@level2type = N'Column', @level2name = 'body';
GO

EXEC sp_addextendedproperty
@name = N'Column_Description',
@value = 'remove or not',
@level0type = N'Schema', @level0name = 'dbo',
@level1type = N'Table',  @level1name = 'Like',
@level2type = N'Column', @level2name = 'status';
GO

EXEC sp_addextendedproperty
@name = N'Column_Description',
@value = 'reply other comment',
@level0type = N'Schema', @level0name = 'dbo',
@level1type = N'Table',  @level1name = 'Comment',
@level2type = N'Column', @level2name = 'parent_id';
GO

EXEC sp_addextendedproperty
@name = N'Column_Description',
@value = 'pin to head post',
@level0type = N'Schema', @level0name = 'dbo',
@level1type = N'Table',  @level1name = 'Comment',
@level2type = N'Column', @level2name = 'is_pinned';
GO

EXEC sp_addextendedproperty
@name = N'Column_Description',
@value = 'edit or not',
@level0type = N'Schema', @level0name = 'dbo',
@level1type = N'Table',  @level1name = 'Comment',
@level2type = N'Column', @level2name = 'is_edited';
GO

EXEC sp_addextendedproperty
@name = N'Column_Description',
@value = 'last time edit',
@level0type = N'Schema', @level0name = 'dbo',
@level1type = N'Table',  @level1name = 'Comment',
@level2type = N'Column', @level2name = 'updated_at';
GO

EXEC sp_addextendedproperty
@name = N'Column_Description',
@value = 'request',
@level0type = N'Schema', @level0name = 'dbo',
@level1type = N'Table',  @level1name = 'Friendship',
@level2type = N'Column', @level2name = 'user_id_1';
GO

EXEC sp_addextendedproperty
@name = N'Column_Description',
@value = 'respone',
@level0type = N'Schema', @level0name = 'dbo',
@level1type = N'Table',  @level1name = 'Friendship',
@level2type = N'Column', @level2name = 'user_id_2';
GO

EXEC sp_addextendedproperty
@name = N'Column_Description',
@value = 'Type of relationship',
@level0type = N'Schema', @level0name = 'dbo',
@level1type = N'Table',  @level1name = 'Friendship',
@level2type = N'Column', @level2name = 'relationship_type';
GO

EXEC sp_addextendedproperty
@name = N'Column_Description',
@value = 'status = accepted',
@level0type = N'Schema', @level0name = 'dbo',
@level1type = N'Table',  @level1name = 'Friendship',
@level2type = N'Column', @level2name = 'accepted_at';
GO

EXEC sp_addextendedproperty
@name = N'Column_Description',
@value = 'For group chats',
@level0type = N'Schema', @level0name = 'dbo',
@level1type = N'Table',  @level1name = 'Conversation',
@level2type = N'Column', @level2name = 'title';
GO

EXEC sp_addextendedproperty
@name = N'Column_Description',
@value = 'direct: between 2 users, group: for multiple users',
@level0type = N'Schema', @level0name = 'dbo',
@level1type = N'Table',  @level1name = 'Conversation',
@level2type = N'Column', @level2name = 'type';
GO

EXEC sp_addextendedproperty
@name = N'Column_Description',
@value = 'For group chats',
@level0type = N'Schema', @level0name = 'dbo',
@level1type = N'Table',  @level1name = 'Conversation_User',
@level2type = N'Column', @level2name = 'is_admin';
GO

EXEC sp_addextendedproperty
@name = N'Column_Description',
@value = 'Null if still in conversation',
@level0type = N'Schema', @level0name = 'dbo',
@level1type = N'Table',  @level1name = 'Conversation_User',
@level2type = N'Column', @level2name = 'left_at';
GO

EXEC sp_addextendedproperty
@name = N'Column_Description',
@value = 'ID of shared content if message_type is shared_post',
@level0type = N'Schema', @level0name = 'dbo',
@level1type = N'Table',  @level1name = 'Message',
@level2type = N'Column', @level2name = 'shared_content_id';
GO

EXEC sp_addextendedproperty
@name = N'Column_Description',
@value = 'ID of the item that triggered notification',
@level0type = N'Schema', @level0name = 'dbo',
@level1type = N'Table',  @level1name = 'Home_Notification',
@level2type = N'Column', @level2name = 'reference_id';
GO

EXEC sp_addextendedproperty
@name = N'Column_Description',
@value = 'Type of reference (post, comment, like, etc.)',
@level0type = N'Schema', @level0name = 'dbo',
@level1type = N'Table',  @level1name = 'Home_Notification',
@level2type = N'Column', @level2name = 'reference_type';
GO

ALTER TABLE [Post] ADD FOREIGN KEY ([user_id]) REFERENCES [User] ([id])
GO

ALTER TABLE [Like] ADD FOREIGN KEY ([post_id]) REFERENCES [Post] ([id])
GO

ALTER TABLE [Like] ADD FOREIGN KEY ([user_id]) REFERENCES [User] ([id])
GO

ALTER TABLE [Comment] ADD FOREIGN KEY ([parent_id]) REFERENCES [Comment] ([id])
GO

ALTER TABLE [Comment] ADD FOREIGN KEY ([user_id]) REFERENCES [User] ([id])
GO

ALTER TABLE [Comment] ADD FOREIGN KEY ([post_id]) REFERENCES [Post] ([id])
GO

ALTER TABLE [Friendship] ADD FOREIGN KEY ([user_id_1]) REFERENCES [User] ([id])
GO

ALTER TABLE [Friendship] ADD FOREIGN KEY ([user_id_2]) REFERENCES [User] ([id])
GO

ALTER TABLE [Conversation_User] ADD FOREIGN KEY ([conversation_id]) REFERENCES [Conversation] ([id])
GO

ALTER TABLE [Conversation_User] ADD FOREIGN KEY ([user_id]) REFERENCES [User] ([id])
GO

ALTER TABLE [Message] ADD FOREIGN KEY ([conversation_id]) REFERENCES [Conversation] ([id])
GO

ALTER TABLE [Message] ADD FOREIGN KEY ([sender_id]) REFERENCES [User] ([id])
GO

ALTER TABLE [Home_Notification] ADD FOREIGN KEY ([user_id]) REFERENCES [User] ([id])
GO

ALTER TABLE [Message_Notification] ADD FOREIGN KEY ([user_id]) REFERENCES [User] ([id])
GO

ALTER TABLE [Message_Notification] ADD FOREIGN KEY ([conversation_id]) REFERENCES [Conversation] ([id])
GO

ALTER TABLE [Message_Notification] ADD FOREIGN KEY ([sender_id]) REFERENCES [User] ([id])
GO

ALTER TABLE [Message_Notification] ADD FOREIGN KEY ([message_id]) REFERENCES [Message] ([id])
GO

ALTER TABLE [User_Setting] ADD FOREIGN KEY ([user_id]) REFERENCES [User] ([id])
GO
