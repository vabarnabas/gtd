import Cookies from "universal-cookie"

class TokenService {
  public async saveToken(token: string): Promise<void> {
    const cookies = new Cookies()
    cookies.set("gtd-token", token, { path: "/" })
  }

  public async deleteToken(): Promise<void> {
    const cookies = new Cookies()
    cookies.remove("gtd-token", { path: "/" })
  }

  public getToken(): Promise<any> {
    const cookies = new Cookies()
    return cookies.get("gtd-token")
  }
}

export default TokenService
