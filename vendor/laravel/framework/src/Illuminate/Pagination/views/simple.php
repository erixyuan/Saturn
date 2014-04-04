<?php
	$presenter = new Illuminate\Pagination\BootstrapPresenter($paginator);
	$trans = $environment->getTranslator();
?>

<?php if ($paginator->getLastPage() > 1): ?>
    <div class="fn-clear g-pagination g-pagination-simple">
        <ul class="fn-clear pager">
            <?php
                echo $presenter->getPrevious($trans->trans('上一页'));
                echo $presenter->getNext($trans->trans('下一页'));
            ?>
        </ul>
    </div>
<?php endif; ?>
