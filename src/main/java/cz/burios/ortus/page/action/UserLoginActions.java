package cz.burios.ortus.page.action;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.annotation.WebServlet;

@WebServlet("/action/UserLogin")
public class UserLoginActions extends ActionsConnector {

	private static final long serialVersionUID = 8988586592552939654L;

	public UserLoginActions() {}

	public Object execute(Map<String, Object> params) throws Exception {
		System.out.println("UserLoginActions.params: " + params);
		response().setCharacterEncoding("UTF-8");
		response().setContentType("application/json");

		Map<String, Object> result = new HashMap<String, Object>();
		try {
			// sem vložit autetikaci
			result.put("errorCode", "OK");
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}
}
