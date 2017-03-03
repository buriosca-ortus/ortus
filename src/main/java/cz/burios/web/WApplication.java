package cz.burios.web;

//import cz.burios.uniql.DBContext;

public class WApplication {

	private static WApplication instance;
	
	private static String title;
	private static String baseUrl;
	
	//private static DBContext db;

	protected WApplication() {

	}

	public static WApplication instance() {
		if (instance == null) {
			instance = new WApplication(); 
		}
		return instance;
	}

	/**
	 * @return the title
	 */
	@SuppressWarnings("static-access")
	public static String getTitle() {
		return WApplication.instance().title;
	}

	/**
	 * @param title the title to set
	 */
	@SuppressWarnings("static-access")
	public static void setTitle(String title) {
		WApplication.instance().title = title;
	}

	/**
	 * @return the baseUrl
	 */
	@SuppressWarnings("static-access")
	public static String getBaseUrl() {
		return WApplication.instance().baseUrl;
	}

	/**
	 * @param baseUrl the baseUrl to set
	 */
	@SuppressWarnings("static-access")
	public static void setBaseUrl(String baseUrl) {
		WApplication.instance().baseUrl = baseUrl;
	}

	/**
	 * @return the db
	 */
	/*
	@SuppressWarnings("static-access")
	public static DBContext db() {
		return WApplication.instance().db;
	}
	*/
	/**
	 * @param db the db to set
	 */
	/*
	@SuppressWarnings("static-access")
	public static void setDBContext(DBContext db) {
		WApplication.instance().db = db;
	}
	*/
	
}
