import { json } from "@sveltejs/kit";
import { authCheck } from "$fn/helper";

export async function PUT({ request, locals: { supabase, getSession } }) {
    const session = await getSession();
    const isValidUser = await authCheck(supabase, session, "!reader,editor");
    if (!isValidUser) {
        return json({ error: { code: 400, message: "You do not have permission" } });
    }

    const body = await request.json();

    const targetUser = await supabase.auth.admin.getUserById(body.user.id);
    const targetUserRole = targetUser.data.user.user_metadata.role;

    const role = session.user.user_metadata.role;

    const allowedRoles = ["manager", "admin", "owner"];
    console.log("myRole:", role, "targetRole:", targetUserRole);
    if (!allowedRoles.includes(role)) {
        return json({
            error: {
                code: 403,
                message: "You do not have enough permission to update this user role",
            },
        });
    }

    const managerTargetLimitation = ["manager", "admin", "owner"];
    if (role == "manager" && !managerTargetLimitation.includes(targetUserRole)) {
        return json({
            error: {
                code: 403,
                message: "You do not have enough permission to update this user role",
            },
        });
    }

    if (role == "admin" && targetUserRole == "admin") {
        return json({
            error: {
                code: 403,
                message: "You do not have enough permission to update this user role",
            },
        });
    }

    if (role == "admin" && targetUserRole == "owner") {
        return json({
            error: {
                code: 403,
                message: "Whoops! Looks like you're trying to outboss the boss. 😡",
            },
        });
    }

    const { data: user, error } = await supabase.auth.admin.updateUserById(body.user.id, {
        user_metadata: { role: body.newRole },
    });

    if (error) {
        return json({ error: { code: error.code, message: error.message } });
    }

    return json(user.user);
}
