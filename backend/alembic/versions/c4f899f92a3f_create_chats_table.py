"""Create chats, messages, and indexes tables with timestamps and soft delete

Revision ID: c4f899f92a3f
Revises: abc123
Create Date: 2024-04-28 14:59:40.261774

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.mysql import LONGTEXT


# revision identifiers, used by Alembic.
revision: str = 'c4f899f92a3f'
down_revision: Union[str, None] = 'abc123'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('chats',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), nullable=False),
        # sa.Column('organization_id', sa.INTEGER(), nullable=True),
        sa.Column('retrieval', sa.JSON(), nullable=True),
        sa.Column('tools', sa.JSON(), nullable=True),
        sa.Column('system', sa.TEXT(), nullable=True),
        sa.Column('created_at', sa.DATETIME(), nullable=False),
        sa.Column('updated_at', sa.DATETIME(), nullable=False),
    )
    op.create_index('ix_chats_user_id', 'chats', ['user_id'])
    # op.create_index('ix_chats_organization_id', 'chats', ['organization_id'])
    
    op.create_table('indexes',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('chat_id', sa.String(36), nullable=False, unique=True),
        sa.Column('index_name', sa.INTEGER(), nullable=False),
        sa.Column('created_at', sa.DATETIME(), nullable=False),
        sa.Column('updated_at', sa.DATETIME(), nullable=False),
        sa.ForeignKeyConstraint(['chat_id'], ['chats.id'], ondelete='CASCADE'),
    )
    op.create_index('ix_indexes_chat_id', 'indexes', ['chat_id'])

    op.create_table('messages',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('chat_id', sa.String(36), nullable=False),
        sa.Column('role', sa.String(20), nullable=False),
        sa.Column('content', sa.TEXT(), nullable=False),
        sa.Column('model', sa.String(50), nullable=True),
        sa.Column('created_at', sa.DATETIME(), nullable=False),
        sa.ForeignKeyConstraint(['chat_id'], ['chats.id'], ondelete='CASCADE'),
    )
    op.create_index('ix_messages_chat_id', 'messages', ['chat_id'])
    op.create_index('ix_messages_created_at', 'messages', ['created_at'])
    
    op.create_table('images',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('message_id', sa.String(36), nullable=False),
        sa.Column('content', LONGTEXT, nullable=False),
        sa.ForeignKeyConstraint(['message_id'], ['messages.id'], ondelete='CASCADE'),
    )
    op.create_index('ix_images_message_id', 'images', ['message_id'])

    op.create_table('sources',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('message_id', sa.String(36), nullable=False),
        sa.Column('index_id', sa.String(36), nullable=True),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('type', sa.String(50), nullable=False),
        sa.Column('src', LONGTEXT, nullable=False),
        sa.ForeignKeyConstraint(['message_id'], ['messages.id'], ondelete='CASCADE'),
    )
    op.create_index('ix_sources_message_id', 'sources', ['message_id'])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index('ix_sources_message_id', table_name='sources')
    op.drop_table('sources')
    
    op.drop_index('ix_images_message_id', table_name='images')
    op.drop_table('images')
    
    op.drop_index('ix_messages_chat_id', table_name='messages')
    op.drop_index('ix_messages_created_at', table_name='messages')
    op.drop_table('messages')
    
    op.drop_index('ix_indexes_chat_id', table_name='indexes')
    op.drop_table('indexes')
    
    op.drop_index('ix_chats_user_id', table_name='chats')
    # op.drop_index('ix_chats_organization_id', table_name='chats')
    op.drop_table('chats')
    # ### end Alembic commands ###
