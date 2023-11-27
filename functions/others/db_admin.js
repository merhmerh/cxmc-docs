import { supabase } from "../src/helper.js";

const {
    data: { users },
    error,
} = await supabase.auth.admin.listUsers();

for (const user of users) {
    if (user.email == "weitheng.low@aecom.com") {
        const { data: updatedUser, error } = await supabase.auth.admin.updateUserById(user.id, {
            user_metadata: { referral: "wen_xingyue@bca.gov.sg" },
        });

        console.log(updatedUser);
        break;
    }
}
