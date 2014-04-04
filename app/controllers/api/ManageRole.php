<?php

class ManageRole extends \BaseController {

    public function __construct() {
        $this->beforeFilter('auth');
    }

    /**
     * 角色列表
     *
     * @return Response
     */
    public function index() {
        return $roles = Role::All();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create() {
        $perms      = Permission::All();
        $perm_check = [];
        foreach ($perms as $p) {
            $perm_check[$p->name] = false;
        }
        $a_perms = $perms->toArray();
        foreach ($a_perms as $k => $a) {
            $a_perms[$k]['allow'] = $perm_check[$a['name']];
        }
        $tree = new Tree($a_perms, ['id', 'parent_id']);
        return ['permission' => $tree->leaf(0)];
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store() {
        if ($id = Input::get('id')) {
            $role = Role::find($id);
        } else {
            $role = new Role;
        }

        $inputs = Input::only(['name', 'display_name']);
        $rules  = [
            'name'         => 'required|min:1',
            'display_name' => 'required',
        ];

        $validator = Validator::make($inputs, $rules);

        if ($validator->fails()) {
            $messages = $validator->messages()->toArray();
            return $this->msg($messages, 1);
        }
        $role->fill($inputs);
        $role->save();

        $perm_need_sync = [];
        if (Input::has('perms') && is_array(Input::get('perms'))) {
            foreach (Input::get('perms') as $k => $v) {
                if ($v && $perm = Permission::where('name', $k)->first()) {
                    $perm_need_sync[] = $perm->id;
                }
            }
        }
        $role->perms()->sync($perm_need_sync);

        return $this->msg('success', 0);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id) {
        $role = Role::find($id);
        if (!$role) {
            return array(
                'msg'     => "角色不存在.",
                'errCode' => 1,
            );
        }
        $perms      = Permission::All();
        $perm_check = [];
        foreach ($perms as $p) {
            if ($role->hasPermission($p->name)) {
                $perm_check[$p->name] = true;
            } else {
                $perm_check[$p->name] = false;
            }
        }
        $a_perms = $perms->toArray();
        foreach ($a_perms as $k => $a) {
            $a_perms[$k]['allow'] = $perm_check[$a['name']];
        }
        $tree             = new Tree($a_perms, ['id', 'parent_id']);
        $role->permission = $tree->leaf(0);
        return $role;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id) {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update($id) {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id) {
        $category = Role::find($id);

        if (is_null($category)) {
            return $this->msg('role not exist', 1);
        }
        $category->delete();
        return $this->msg('role id:$id deleted', 0);
    }

}
