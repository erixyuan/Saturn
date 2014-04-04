<?php

class BaseController extends Controller {

    /**
     * Setup the layout used by the controller.
     *
     * @return void
     */
    protected function setupLayout() {
        if (!is_null($this->layout)) {
            $this->layout = View::make($this->layout);
        }
    }

    protected function msg($msg = 'success', $errCode = 0) {
        return array(
            'success' => (bool) !$errCode,
            'msg'     => $msg,
            'errCode' => (int) $errCode,
        );
    }

}
