module.exports = {
    //登录事件
    "SEND_AUTH":"auth",
    "SEND_LOGIN":"login",
    "SEND_PHONE_LOGIN":"phone_login",
    "RECEIVE_LOGIN_RESULT":"login_result_notify",

    //服务器信息
    "RECEIVE_SERVER_INFO":"server_info_notify",

    //财富信息
    "SEND_WEALTH":"wealth",
    "RECEIVE_WEALTH":"wealth",
    "GET_WIN_DETAIL":"get_win_detail",
    //发送手机号码
    "SEND_PHONE_NUM":"send_phone_num",
    "RESET_PASSWORD":"reset_password",
    "RECEIVE_CHECKED_RESULT":"receive_checked_result",

    "MSG_EVENT"     : "msg_event",          
    "GET_MSG_EVENT" : "get_msg_event",
    "GET_RECORD_EVENT":"get_record_event",  
    "GET_PERSON_OF_GAME":"get_person_of_game",
    
    "EVENT_CHANGE_NAME":"event_change_name",
    "EVENT_EXCHANGE_GOLD":"event_exchange_gold",

    //大厅信息
    "SEND_HALL_MSG_REQ":"get_hall_msg",
    "RECEIVE_HALL_MSG":"hall_msg_notify",
    "SEND_GET_RECORD":"get_record",
    "SEND_GET_ONCERECORD":"get_once_record",
    "RECEIVE_ONCERECORD":"once_record",
    "RECEIVE_RECORD":"record",
    "SEND_GET_RECORD_DETAIL":"get_record_detail",
    "RECEIVE_RECORD_DETAIL":"record_detail",
    "RETURNLEAF":"returnLeaf",
    
    "SEND_DISSOLEVEROOM":"get_dissolveroom_msg",
    "RECEIVE_DISSOLVEROOM":"dissolveroom_msg_info",

    //头像信息
    "SEND_GET_HEADIMG_URL":"get_headimg_url",
    "RECEIVE_USER_HEADIMG_URL":"headimg_url",

    //创建房间
    "SEND_CREATE_ROOM":"create_room",
    "RECEIVE_CREATE_ROOM_RESULT":"create_room_result",

    
    //加入房间
    "SEND_ENTER_ROOM":"enter_room",
    "RECEIVE_ENTER_ROOM_RESULT":"enter_room_result",

    //sign信息失效
    "RECEIVE_SIGN_IVVALID":"sign_invalid",

    //分享与绑定代理
    "SEND_SHARE":"share",
    "SEND_BIND_AGENT":"bind_agent",
    "RECEIVE_GIFT_NOTIFY":"gift_notify",
    "RECEIVE_BIND_AGENT_RESULT":"bind_agent_result",

    //游戏信息
    "SEND_GET_GAME_INFO":"get_game_info",
    "RECEIVE_GAME_INFO":"game_info",

    //关于聊天
    "SEND_VOICE_MSG":"voice_msg",
    "RECEIVE_VOICE_MSG":"voice_msg",

    //快速聊天
    "SEND_QUICK_CHAT":"quick_chat",
    "RECEIVE_QUICK_CHAT":"quick_chat",

    //自定义聊天
    "SEND_CHAT":"chat",
    "RECEIVE_CHAT":"chat",
    //表情
    "SEND_EMOJI":"emoji",
    "RECEIVE_EMOJI_MSG":"emoji_msg",

    "RECEIVE_PLAYER_ONLINE_STATUS_CHANGE":"player_online_status_change",
    //提示信息
    "RECEIVE_PROMPT":"prompt",

    // 在分享中进入游戏
    "LOGIN_ENTERROOM":"login_enterRoom",
    "LOGIN_ENTER_RESULT":"login_enter_result",

    "OTHERPLACECONNET":"otherPlaceConnet",


    /* ----------------- 俱乐部 ----------------- */ 
    "CLUB_CREATE_EVENT":"create_club",
    "GET_ALL_CLUB_EVENT":"get_all_club",
    "GET_CLUB_EVENT":"get_club",
    "LEAVE_CLUB_EVENT":"leave_club",
    "DISSOLVE_CLUB_EVENT":"dissolve_club",
    "DELETE_USER_EVENT":"delete_user",
    "APPLY_JOIN_EVENT":"apply_join_club",
    "AGREE_JOIN_EVENT":"agree_join_club",
    "INVITE_FRIEND_EVENT":"invite_club_friend",//邀请好友
    "SELECT_CLUB_EVENT":"select_club",      // 查询俱乐部
    "PLAYER_DEEDS_EVENT":"player_deeds",    // 俱乐部玩家事迹
    "IS_IN_ROOM_EVENT":"is_in_room",        // 在房间或者大厅
    "CREATE_CLUB_ROOM_EVENT":"create_club_room",    // 创建房间
    "DISSOLVE_CLUB_ROOM_EVENT":"dissolve_club_room",// 解散房间
    "ENTER_CLUB_ROOM_EVENT":"enter_club_room",      // 进入房间
    "UPDATE_CLUB_NAME_EVENT":"update_club_name",
    "UPDATE_CLUB_NOTICE_EVENT":"update_club_notice",
    "ADD_CHIP_EVENT":"add_chip",
    "ADD_CLUB_LEAF_EVENT":"add_club_leaf",
    "DEDUCT_CLUB_LEAF_EVENT":"deduct_Club_Leaf",
    "GET_PLAYER_CHIP_EVENT":"get_player_chip",
    "GET_PLAYER_DETAIL_EVENT":"get_player_detail",
    "GET_CLUB_CONSUME_EVENT":"get_club_consume",
    "GET_CLUB_RECHARGE_EVENT":"get_club_recharge",
    "GET_PLAYER_INCLUB_EVENT":"get_player_club",
    "RECEIVE_PLAYER_INCLUB_EVENT":"get_player_inclub",
    "SEND_CHAT_MSG":"send_chat_msg",    
    "RECEIVE_CHAT_MSG":"receive_chat_msg",    
    "GET_CLUB_CHAT_EVENT":"get_club_chat",    

    /* ----------------- 俱乐部end ----------------- */ 
    
    //有不同游戏的事件
    Nn:{
        //准备
        "SEND_READY":"nn_ready",
        "RECEIVE_READY":"nn_ready",

        "RECEIVE_PLAYER_ENTER":"nn_player_enter",
        //离开游戏
        "SEND_LEAVE":"nn_leave",
        "RECEIVE_PLAYER_LEAVE":"nn_player_leave",
        //解散房间时的所有操作
        "SEND_DISSOLVE":"nn_dissolve",
        "RECEIVE_DISSOLVE_REQUEST":"nn_dissolve_request",

        "SEND_DISSOLVE_AGREE":"nn_dissolve_agree",
        "RECEIVE_DISSOLVE_AGREE":"nn_dissolve_agree",

        "SEND_DISSOLVE_REFUSE":"nn_dissolve_refuse",
        "RECEIVE_DISSOLVE_REFUSE":"nn_dissolve_refuse",

        "RECEIVE_DISSOLVE_NOTIFY":"nn_dissolve_notify",
        //游戏开始
        "SEND_GAME_BEGIN":"nn_game_begin",
        "RECEIVE_GAME_BEGIN":"nn_game_begin",
        "RECEIVE_GAME_INDEX_CHANGE":"nn_game_index_change",
        //随机庄家确定
        "RECEIVE_RANDOM_BANKER_CONFIRM":"nn_random_banker_confirm",
        //下注
        "RECEIVE_PLEASE_BETTING":"nn_please_betting",
        "SEND_BETTING":"nn_betting",
        "RECEIVE_BETTING":"nn_betting",
        "RECEIVE_ALL_PLAYER_BETTING":"nn_all_player_betting",
        //发牌
        "RECEIVE_DEAL":"nn_deal",
        //看牌
        "SEND_SEE":"nn_see",
        "RECEIVE_SEE_ALL_CARDS":"nn_see_all_cards",
        //出牌
        "SEND_PLAY_CARDS":"nn_play_cards",
        "RECEIVE_PLAY_CARDS":"nn_play_cards",
        //抢庄
        "SEND_GRAB":"nn_grab",
        "RECEIVE_GRAB_BANKER":"nn_grab_banker",
        //比牌完成
        "RECEIVE_COMPARE_FINISH":"nn_compare_finish",
        //游戏结算
        "RECEIVE_GAME_ENDING":"nn_game_ending",

        "PLAYER_SEAT_EVENT":"nn_player_seat",
        "PLAYER_STANDUP_EVENT":"nn_player_standUp",
        "ASK_LEAVE_EVENT":"nn_ask_leave",
        "IS_AGREEGEM_EVENT":"nn_is_agree_gem",
        "DESTROY_EVENT":"nn_destroy",
        "IS_AGREE_LEAVE_EVENT":"nn_is_agree_leave",
        "PLAYER_IN_SEAT_EVENT":"nn_player_inSeat",
    },
    Ssz:{
        "EVENT_INTERACTION":"interaction",
        "ONCE_AGAIN":"onceAgain",
        "SEND_GAME_START":"game_start",
        "RECEIVE_PLAYER_ENTER":"ssz_player_enter",
        //准备
        "SEND_READY":"ssz_ready",
        "RECEIVE_READY":"ssz_ready",

        "RECEIVE_DEAL":"ssz_deal",
        //出牌
        "SEND_OUT":"ssz_out",
        "RECEIVE_OUT":"ssz_out",

        // 玩家家坐下
        "SEND_PLAYER_ASK_SEAT":"ask_seat",
        "RECEIVE_IS_AGREEGOLD":"is_agree_gold",
        "SEND_PLAYER_SEAT":"player_seat",
        "RECEIVE_PLAYER_SEAT":"player_seat",
        
        // 玩家站起
        "SEND_PLAYER_STANDUP":"player_standUp",
        "RECEIVE_PLAYER_STANDUP":"player_standUp",
        "EVENT_AGREE_GEM":"agree_gem",
        "SEND_PLAYER_AUTO_STANDUP":"player_auto_standup",

        "RECEIVE_COMPARE":"ssz_compare",

        //离开
        "SEND_LEAVE":"ssz_leave",
        "SEND_AUTO_LEAVE":"ssz_auto_leave",
        "SEND_AGREE_RESULT":"agree_result",
        "RECEIVE_LEAVE":"ssz_leave",
        "RECEIVE_IS_AGREELEAVE":"is_agree_leave",
        "RECEIVE_ASK_LEAVE":"ssz_ask_leave",
        "RECEIVE_TIMEOUT":"ssz_time_out",
        "PLAYERINSEAT":"player_inSeat",
        // "RECEIVE_DESTROY":"",
        "RECEIVE_DESTROY":"ssz_destroy",
        "SEND_GET_RECORD":"get_record",
        "RECEIVE_RECORD":"receive_record",
        "GET_REAL_WAR":"get_real_war",
        "SSZ_ADD_GOLD":"ssz_add_gold",
        "RECEIVE_LESS_ADDGOLD":"less_add_gold",
    },
    cb:{
        "CB_NEW_PLAYER_ENTER":"cb_player_enter",
        "CB_START_GAME_EVENT":"cb_start_game",
        "CB_NEXT_GAME_EVENT":"cb_next_game",

        "CB_TURN_ON_EVENT":"cb_turn_on",
        "CB_RESET_BETTING_EVENT":"cb_reset_betting",
        "CB_PLAYER_BETTING_EVENT":"cb_player_betting",
        "CB_CAN_BETTING_EVENT":"cb_can_betting",
        "CB_BANKER_PUSH_BAO_EVENT":"cb_banker_push_bao",
        "CB_LEAVE_ROOM_EVENT":"leave_room",
        "CB_DISSOLVE_ROOM_EVENT":"dissolve_room",
        "CB_GAME_END_EVENT":"cb_game_end",
        "CB_AGAIN_EVENT":"cb_again",
    }
};
