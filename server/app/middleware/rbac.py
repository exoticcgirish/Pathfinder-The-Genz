from functools import wraps

from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt


def role_required(*allowed_roles):

    def decorator(function):

        @wraps(function)
        @jwt_required()
        def wrapper(*args, **kwargs):

            claims = get_jwt()

            user_role = claims.get("role")

            if not user_role:
                return jsonify({
                    "success": False,
                    "message": "Role not found in token"
                }), 403

            if user_role not in allowed_roles:
                return jsonify({
                    "success": False,
                    "message": "Access denied",
                    "requiredRoles": list(allowed_roles),
                    "yourRole": user_role
                }), 403

            return function(*args, **kwargs)

        return wrapper

    return decorator