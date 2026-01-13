import scratchattach from "scratchattach";

export async function connectScratch() {
  const session = await scratchattach.login(
    process.env.SCRATCH_USER,
    process.env.SCRATCH_PASS
  );

  const cloud = await session.cloud(
    process.env.SCRATCH_PROJECT_ID
  );

  console.log("✅ Scratch logged in (scratchattach)");
  return cloud;
}
