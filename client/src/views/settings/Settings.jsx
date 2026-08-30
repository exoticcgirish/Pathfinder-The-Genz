import {
  Bell,
  Lock,
  Palette,
  Settings as SettingsIcon,
  User,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 px-5 py-8 md:px-8">
      <div className="mx-auto max-w-5xl">

        <div className="mb-8">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-indigo-600">
            Account
          </p>

          <h1 className="text-3xl font-extrabold text-slate-900">
            Settings
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your Pathfinder preferences and account settings.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <User size={20} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Account
                </h2>

                <p className="text-xs text-slate-500">
                  Your Pathfinder account information
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-400">
                  Name
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {user?.name ||
                    user?.fullName ||
                    "Learner"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400">
                  Email
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {user?.email || "Not available"}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Bell size={20} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Notifications
                </h2>

                <p className="text-xs text-slate-500">
                  Learning reminders and milestones
                </p>
              </div>
            </div>

            <label className="flex items-center justify-between border-b border-slate-100 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Learning reminders
                </p>
                <p className="text-xs text-slate-500">
                  Remind me about my weekly learning goal
                </p>
              </div>

              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 accent-indigo-600"
              />
            </label>

            <label className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Milestone alerts
                </p>
                <p className="text-xs text-slate-500">
                  Notify me when roadmap milestones unlock
                </p>
              </div>

              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 accent-indigo-600"
              />
            </label>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Palette size={20} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Learning Experience
                </h2>

                <p className="text-xs text-slate-500">
                  Personalization preferences
                </p>
              </div>
            </div>

            <p className="text-sm leading-6 text-slate-600">
              Your learning preference, interests, career goal and weekly
              availability are managed from your profile.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Lock size={20} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Privacy & Security
                </h2>

                <p className="text-xs text-slate-500">
                  Authentication and learning data
                </p>
              </div>
            </div>

            <p className="text-sm leading-6 text-slate-600">
              Your personalized learning data is linked to your authenticated
              Pathfinder account.
            </p>
          </section>

        </div>

        <div className="mt-5 flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
          <SettingsIcon size={17} />

          More settings can be connected as Pathfinder grows.
        </div>

      </div>
    </div>
  );
};

export default Settings;