/**
 * Real-Time Session Manager for DUDI SOFTWARE
 * Manages active Server-Sent Events (SSE) streams and broadcasts instantaneous account actions (e.g. Kick on Ban)
 */

class SessionManager {
  constructor() {
    // Map: userId (string) -> Set of active Express Response objects
    this.sessions = new Map();
  }

  /**
   * Register an active client session
   */
  addSession(userId, res) {
    if (!userId) return;
    const uid = userId.toString();

    if (!this.sessions.has(uid)) {
      this.sessions.set(uid, new Set());
    }

    const userSet = this.sessions.get(uid);
    userSet.add(res);

    // Setup periodic heartbeat ping to prevent proxy timeouts (every 20s)
    const heartbeatInterval = setInterval(() => {
      try {
        if (!res.writableEnded && !res.destroyed) {
          res.write(": heartbeat\n\n");
        } else {
          clearInterval(heartbeatInterval);
        }
      } catch {
        clearInterval(heartbeatInterval);
      }
    }, 20000);

    // Clean up when connection drops or is closed
    const cleanUp = () => {
      clearInterval(heartbeatInterval);
      if (this.sessions.has(uid)) {
        const set = this.sessions.get(uid);
        set.delete(res);
        if (set.size === 0) {
          this.sessions.delete(uid);
        }
      }
    };

    res.on("close", cleanUp);
    res.on("finish", cleanUp);
    res.on("error", cleanUp);
  }

  /**
   * Real-time kick user: instantly notify their browser, revoke session, and close connection
   */
  kickUser(userId, reason = "Tài khoản của bạn đã bị khóa bởi Quản trị viên.") {
    if (!userId) return;
    const uid = userId.toString();

    if (this.sessions.has(uid)) {
      const userConnections = this.sessions.get(uid);
      const payload = JSON.stringify({
        type: "ACCOUNT_BANNED",
        reason,
        timestamp: Date.now(),
      });

      userConnections.forEach((res) => {
        try {
          if (!res.writableEnded && !res.destroyed) {
            res.write(`event: KICK\ndata: ${payload}\n\n`);
            res.end();
          }
        } catch (err) {
          console.error(`[SessionManager] Lỗi khi gửi kick event cho user ${uid}:`, err.message);
        }
      });

      this.sessions.delete(uid);
      console.log(`⚡ [Realtime Kick] Đã cưỡng chế đăng xuất realtime thành công cho User ID: ${uid}`);
    }
  }

  /**
   * Get total online users connected
   */
  getOnlineCount() {
    return this.sessions.size;
  }
}

export const sessionManager = new SessionManager();
