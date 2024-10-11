"""update_users_table_for_oauth

Revision ID: 96e5356987f5
Revises: 07d4856c3f84
Create Date: 2024-08-14 22:33:33.183480

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '96e5356987f5'
down_revision: Union[str, None] = '07d4856c3f84'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column('users', 'password', nullable=True)
    op.alter_column('users', 'salt', nullable=True)
    op.add_column('users', sa.Column('oauth_provider', sa.String(50), nullable=True))
    op.add_column('users', sa.Column('access', sa.Integer(), nullable=False, server_default='0'))


def downgrade() -> None:
    op.drop_column('users', 'access')
    op.drop_column('users', 'oauth_provider')
    op.alter_column('users', 'password', nullable=False)
    op.alter_column('users', 'salt', nullable=False)